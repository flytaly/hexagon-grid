import React, { useRef, useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Container, Typography } from '@material-ui/core'
import { CanvasState, CanvasStateAction, GridType } from '../canvas-state-types'
import { toHslaStr } from '../helpers'
import { checkered } from '../background'
import Worker from '../grid-generators/generate-data.worker'
import { getGridCellSizes, getHexCellSize } from '../grid-generators/get-sizes'
import drawPolygons from '../grid-generators/draw-polygons'
import Keys from './keys'
import ExportModal from './export-modal'
import { drawImageProp } from '../draw-image'

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
    const [imgData, setImgData] = useState<Uint8ClampedArray | null>(null)
    const classes = useStyles()

    useEffect(() => {
        if (state.noise.imageDataString && state.noise.baseNoise.id === 'image') {
            const { cellsNumW, cellsNumH } =
                state.grid.type === 'hexagons'
                    ? getHexCellSize(state.cell, state.canvasSize, state.grid)
                    : getGridCellSizes(state.cell.size, state.canvasSize)

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = cellsNumW
            canvas.height = cellsNumH
            const img = new Image()
            img.src = state.noise.imageDataString
            img.onload = () => {
                if (!ctx) return
                drawImageProp(ctx, img)
                setImgData(ctx.getImageData(0, 0, cellsNumW, cellsNumH).data)
            }
            document.body.appendChild(canvas)
        }
    }, [
        state.canvasSize,
        state.cell,
        state.grid,
        state.noise.baseNoise.id,
        state.noise.imageDataString,
    ])

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

    useEffect(() => {
        const context = refCanv.current?.getContext('2d')
        if (!context || !state.canvasSize.wasMeasured) return
        if (state.noise.baseNoise.id !== 'image') {
            genGridWorker?.postMessage({ state, imgData })
        }
    }, [state, genGridWorker, imgData])

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

        const vertsPerPolygon = {
            triangles: 3,
            hexagons: 6,
            voronoi: 0, // 'variable'
        }
        const verticesNum = vertsPerPolygon[canvasData.type]

        drawPolygons({
            borderColor: toHslaStr(state.colors.border),
            borderWidth: state.cell.borderWidth,
            closePath: canvasData.type === 'hexagons',
            ctx,
            fillColors: canvasData.fillColors,
            vertices: canvasData.vertices,
            verticesNum,
        })
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
