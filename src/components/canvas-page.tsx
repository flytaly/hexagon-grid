import React, { useRef, useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Container, Typography } from '@material-ui/core'
import { CanvasState, CanvasStateAction, GridType } from '../canvas-state-types'
import { toHslaStr } from '../helpers'
import { checkered } from '../background'
import Worker from '../grid-generators/generate-data.worker'
import drawHexagons from '../grid-generators/draw-hexagons'
import drawTriangles from '../grid-generators/draw-triangles'
import Keys from './keys'
import ExportModal from './export-modal'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        canvasBox: {
            position: 'relative',
            display: 'flex',
            padding: theme.spacing(2, 1),
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        canvas: {
            display: 'block',
            maxWidth: '100%',
            maxHeight: '100%',
            background: checkered,
            boxShadow: theme.shadows[10],
        },
    }),
)

type CanvasPageProps = {
    state: CanvasState
    dispatch: React.Dispatch<CanvasStateAction>
}

type CanvasData = {
    vertices: Float32Array | number[]
    fillColors: Float32Array | number[]
    type: GridType
}

const CanvasPage = ({ state, dispatch }: CanvasPageProps) => {
    const { width, height, aspect } = state.canvasSize
    const refCanv = useRef<HTMLCanvasElement>(null)
    const [genHexWorker, setGenHexWorker] = useState<Worker | null>(null)
    const [canvasData, setCanvData] = useState<CanvasData>({
        vertices: [],
        fillColors: [],
        type: state.grid.type,
    })
    const [exportModalOpen, setExportModalOpen] = useState<boolean>(false)
    const classes = useStyles()

    useEffect(() => {
        const worker = new Worker()

        setGenHexWorker(worker)

        worker.addEventListener('message', ({ data }: { data: CanvasData }) => {
            setCanvData(data)
        })
        return () => {
            worker.terminate()
        }
    }, [])

    useEffect(() => {
        const context = refCanv.current?.getContext('2d')
        if (!context || !state.canvasSize.wasMeasured) return
        genHexWorker?.postMessage({ state })
    }, [aspect, height, width, state, genHexWorker])

    useEffect(() => {
        const ctx = refCanv.current?.getContext('2d')
        if (!ctx || !canvasData.vertices.length) return
        ctx.clearRect(0, 0, width, height)
        if (state.colors.background) {
            ctx.save()
            ctx.fillStyle = toHslaStr(state.colors.background)
            ctx.fillRect(0, 0, width, height)
            ctx.restore()
        }

        if (canvasData.type === 'triangles') {
            drawTriangles({
                fillColors: canvasData.fillColors,
                vertices: canvasData.vertices,
                borderWidth: state.cell.borderWidth,
                borderColor: toHslaStr(state.colors.border),
                ctx,
            })
        } else {
            drawHexagons({
                fillColors: canvasData.fillColors,
                vertices: canvasData.vertices,
                borderWidth: state.cell.borderWidth,
                borderColor: toHslaStr(state.colors.border),
                ctx,
            })
        }
    }, [canvasData, width, height, state.colors.border, state.cell.borderWidth, state])

    return (
        <Container className={classes.canvasBox} maxWidth={false}>
            <Typography variant="caption">{`${width}x${height}    offsets: (${state.noise.offsetX};${state.noise.offsetY})`}</Typography>
            <canvas ref={refCanv} className={classes.canvas} width={width} height={height} />
            <Keys
                dispatch={dispatch}
                exportBtnClickHandler={() => {
                    setExportModalOpen((v) => !v)
                }}
            />
            <ExportModal
                canvas={refCanv}
                state={state}
                isOpen={exportModalOpen}
                handleClose={() => {
                    setExportModalOpen(false)
                }}
            />
        </Container>
    )
}

export default CanvasPage
