import React, { useRef, useEffect, useCallback, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Container, Typography } from '@material-ui/core'
import { useGesture } from 'react-use-gesture'
import throttle from 'lodash.throttle'
import { CanvasState, CanvasStateAction, ActionTypes } from '../canvas-state'
import { toHslaStr } from '../helpers'
import { checkered } from '../background'
import Worker from '../generate-hex-data.worker'
import drawHexagons from '../draw-hexagons'

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
}

const CanvasPage = ({ state, dispatch }: CanvasPageProps) => {
    const { width, height, aspect } = state.canvasSize
    const refCanv = useRef<HTMLCanvasElement>(null)
    const [genHexWorker, setGenHexWorker] = useState<Worker | null>(null)
    // const [noises, random] = useNoises(String(state.noise.seed))
    const [canvasData, setCanvData] = useState<CanvasData>({ vertices: [], fillColors: [] })
    const classes = useStyles()
    const incHexSizeThrottled = useCallback(
        throttle(
            (payload: number) => {
                dispatch({ type: ActionTypes.INC_HEX_SIZE, payload: Math.round(payload * 4) / 2 })
            },
            250,
            { leading: true },
        ),
        [],
    )

    const incNoiseOffsets = useCallback(
        throttle(
            (mx: number, my: number) => {
                dispatch({
                    type: ActionTypes.INC_NOISE_OFFSET,
                    payload: {
                        dx: Math.round(mx / 20),
                        dy: Math.round(my / 20),
                    },
                })
            },
            250,
            { leading: true },
        ),
        [],
    )

    const bind = useGesture({
        onPinch: ({ vdva }) => incHexSizeThrottled(vdva[0]),
        onDrag: ({ movement: [mx, my] }) => incNoiseOffsets(-mx, -my),
    })

    useEffect(() => {
        const worker = new Worker()

        setGenHexWorker(worker)

        worker.addEventListener('message', ({ data }) => {
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

        drawHexagons({
            fillColors: canvasData.fillColors,
            vertices: canvasData.vertices,
            borderWidth: state.hex.borderWidth,
            borderColor: toHslaStr(state.colors.hexBorder),
            ctx,
        })
    }, [canvasData, width, height, state.colors.hexBorder, state.hex.borderWidth, state])

    return (
        <Container className={classes.canvasBox} maxWidth={false}>
            <Typography variant="caption">{`${width}x${height}    offsets: (${state.noise.offsetX};${state.noise.offsetY})`}</Typography>
            <canvas
                ref={refCanv}
                className={classes.canvas}
                width={width}
                height={height}
                {...bind()}
            />
        </Container>
    )
}

export default CanvasPage
