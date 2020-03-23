import React, { useRef, useEffect, useCallback, useMemo } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Container, Typography } from '@material-ui/core'
import * as Honeycomb from 'honeycomb-grid'
import { usePinch, useDrag, useGesture } from 'react-use-gesture'
import throttle from 'lodash.throttle'
import { CanvasState, CanvasStateAction, ActionTypes, HexSettings } from '../canvas-state'
import { useNoises } from '../hooks/use-noises'
import drawHexagon from '../draw-hexagon'
import { toHslaStr } from '../helpers'
import { checkered } from '../background'

// just to suppress ts errors
interface HexWithCorrectSetDeclaration extends Omit<Honeycomb.BaseHex<{}>, 'set'> {
    set(hex: { q: number; r: number; s: number }): Honeycomb.Hex<{}>
}

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

const CanvasPage = ({ state, dispatch }: CanvasPageProps) => {
    const { width, height, aspect } = state.canvasSize
    const refCanv = useRef<HTMLCanvasElement>(null)
    const [noises, random] = useNoises(String(state.noise.seed))
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
        const context = refCanv.current?.getContext('2d')
        if (!context || !state.canvasSize.wasMeasured) return

        const { orientation } = state.hex
        const hexSize =
            aspect < 1
                ? (state.hex.size * height * aspect) / 100
                : (state.hex.size * width) / aspect / 100

        const Hex = Honeycomb.extendHex({ size: hexSize, orientation })

        const widthStep = orientation === 'pointy' ? hexSize * Math.sqrt(3) : hexSize * 1.5
        const heightStep = orientation === 'pointy' ? hexSize * 1.5 : hexSize * Math.sqrt(3)
        const widthCount = width / widthStep + 1
        const heightCount = height / heightStep + 1

        context.clearRect(0, 0, width, height)
        if (state.colors.background) {
            context.save()
            context.fillStyle = toHslaStr(state.colors.background)
            context.fillRect(0, 0, width, height)
            context.restore()
        }

        context.beginPath()

        const Grid = Honeycomb.defineGrid(Hex)

        const { zoom, baseNoise, noise2Strength } = state.noise
        const { sparse, signX, signY } = state.grid

        const [rectW, rectH] = [widthCount / sparse, heightCount / sparse]
        const [normalW, normalH] = [
            aspect < 1 ? rectW / 10 : rectW / 10 / aspect,
            aspect < 1 ? (rectH * aspect) / 10 : rectH / 10,
        ]

        const genNoiseAndDraw = (hexagon: Honeycomb.Hex<{}>) => {
            const [x, y] = [
                (hexagon.x - widthCount / 2 + state.noise.offsetX + 1) / zoom,
                (hexagon.y - heightCount / 2 + state.noise.offsetY + 1) / zoom,
            ]
            let noiseValue = noises[baseNoise](signX * x, signY * y, normalW, normalH)

            if (noise2Strength) {
                noiseValue += random.rnd(noise2Strength)
            }
            drawHexagon({ hexagon, noiseValue, ctx: context, state })
        }

        const onCreate = (hex: HexWithCorrectSetDeclaration) => {
            hex.set({ q: hex.q * sparse, r: hex.r * sparse, s: hex.s * sparse })
        }

        Grid.rectangle({
            width: rectW,
            height: rectH,
            start: [-1, -1],
            onCreate: sparse !== 1 ? onCreate : undefined,
        }).forEach(genNoiseAndDraw)
    })

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
