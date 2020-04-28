import React, { useRef, useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Container, Typography } from '@material-ui/core'
import { CanvasState, CanvasStateAction, GridType } from '../canvas-state-types'
import { toRGBAStr } from '../helpers'
import { checkered } from '../background'
import Worker from '../grid-generators/generate-data.worker'
import drawPolygons from '../grid-generators/draw-polygons'
import Keys from './keys'
import ExportModal from './export-modal'
import { useDataFromImageEffect } from '../hooks/use-data-from-image'
import loadingPlaceholder from '../loading-placeholder'

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
    const { width, height } = state.canvasSize
    const refCanv = useRef<HTMLCanvasElement>(null)
    const [genGridWorker, setGenGridWorker] = useState<Worker | null>(null)
    const [canvasData, setCanvData] = useState<CanvasData>({
        vertices: [],
        fillColors: [],
        type: state.grid.type,
    })
    const [exportModalOpen, setExportModalOpen] = useState<boolean>(false)

    const classes = useStyles()

    useEffect(() => {
        const worker = new Worker()

        setGenGridWorker(worker)

        worker.addEventListener('message', ({ data }: { data: CanvasData }) => {
            setCanvData(data)
        })
        return () => {
            worker.terminate()
        }
    }, [])

    useDataFromImageEffect(state, genGridWorker)

    useEffect(() => {
        const context = refCanv.current?.getContext('2d')
        if (state.noise.baseNoise.id === 'image') return
        if (!context || !state.canvasSize.wasMeasured) return
        genGridWorker?.postMessage({ state, imgData: null })
    }, [state, genGridWorker])

    useEffect(() => {
        const ctx = refCanv.current?.getContext('2d')
        if (!ctx) return
        if (!canvasData.vertices.length) {
            loadingPlaceholder(ctx, width, height)
            return
        }

        ctx.clearRect(0, 0, width, height)
        if (state.colors.background) {
            ctx.save()
            ctx.fillStyle = toRGBAStr(state.colors.background)
            ctx.fillRect(0, 0, width, height)
            ctx.restore()
        }

        const vertsPerPolygon = {
            triangles: 3,
            hexagons: 6,
            voronoi: 0, // 'variable'
        }
        const verticesNum = vertsPerPolygon[canvasData.type]

        drawPolygons({
            borderColor: toRGBAStr(state.colors.border),
            borderWidth: state.cell.borderWidth,
            closePath: canvasData.type === 'hexagons',
            ctx,
            fillColors: canvasData.fillColors,
            vertices: canvasData.vertices,
            verticesNum,
            onlyBorder: !!state.colors.noFill,
        })
    }, [
        canvasData,
        width,
        height,
        state.colors.border,
        state.cell.borderWidth,
        state.colors.background,
        state.colors.noFill,
    ])

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
