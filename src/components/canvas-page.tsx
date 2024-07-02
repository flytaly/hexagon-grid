import { Container, Typography } from '@mui/material'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import React, { useEffect, useRef, useState } from 'react'

import { checkered } from '#/background'
import drawPolygons, { PolygonData } from '#/grid-generators/draw-polygons'
import Worker from '#/grid-generators/worker?worker'
import { toRGBAStr } from '#/helpers'
import { useDataFromImageEffect } from '#/hooks/use-data-from-image'
import loadingPlaceholder from '#/loading-placeholder'
import { CanvasState, CanvasStateAction } from '#/state/canvas-state-types'
import ExportModal from './export-modal'
import Keys from './keys'

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

const CanvasPage: React.FC<CanvasPageProps> = ({ state, dispatch }) => {
    const { width, height } = state.canvasSize
    const refCanv = useRef<HTMLCanvasElement>(null)
    const [genGridWorker, setGenGridWorker] = useState<Worker | null>(null)
    const [polygonData, setPolyData] = useState<PolygonData>({
        vertices: [],
        fillColors: [],
        type: state.grid.type,
    })
    const [exportModalOpen, setExportModalOpen] = useState<boolean>(false)

    const classes = useStyles()

    useEffect(() => {
        const worker = new Worker()

        setGenGridWorker(worker)

        worker.addEventListener('message', ({ data }: { data: PolygonData }) => {
            setPolyData(data)
        })
        return () => {
            worker.terminate()
        }
    }, [])

    useDataFromImageEffect(state, genGridWorker)
    //
    useEffect(() => {
        const context = refCanv.current?.getContext('2d')
        if (state.noise.baseNoise.id === 'image') return
        if (!context || !state.canvasSize.wasMeasured) return
        genGridWorker?.postMessage({ state, imgData: null })
    }, [state, genGridWorker, genGridWorker?.postMessage])

    useEffect(() => {
        const ctx = refCanv.current?.getContext('2d')
        if (!ctx) return
        if (!polygonData.vertices.length) {
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

        // Normalize border's width for consistency.
        // 1 is 1 pixel if minimal side is 1080, if not then scale proportionally
        const borderWidth = (state.cell.borderWidth / 1080) * Math.min(width, height)

        drawPolygons({
            borderColor: toRGBAStr(state.colors.border),
            borderWidth,
            closePath: polygonData.type === 'hexagons',
            ctx,
            polygonData,
            fillBody: !state.colors.noFill,
            useBodyColor: !!state.colors.useBodyColor,
        })
    }, [
        polygonData,
        width,
        height,
        state.colors.border,
        state.cell.borderWidth,
        state.colors.background,
        state.colors.noFill,
        state.colors.useBodyColor,
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
                polygonData={polygonData}
                handleClose={() => {
                    setExportModalOpen(false)
                }}
            />
        </Container>
    )
}

export default CanvasPage
