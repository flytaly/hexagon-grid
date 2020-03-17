import React, { useRef, useEffect } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Typography } from '@material-ui/core'
import * as Honeycomb from 'honeycomb-grid'
import { CanvasState } from '../canvas-state'
import { useNoises } from '../hooks/use-noises'
import drawHexagon from '../draw-hexagon'

// just to suppress ts errors
interface HexWithCorrectSetDeclaration extends Omit<Honeycomb.BaseHex<{}>, 'set'> {
    set(hex: { q: number; r: number; s: number }): Honeycomb.Hex<{}>
}

const useStyles = makeStyles(() =>
    createStyles({
        canvasBox: {
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        paper: {
            position: 'relative',
        },
        canvas: {
            display: 'block',
            maxWidth: '100%',
            maxHeight: '90vh',
            // background: 'red',
        },
        sizeCaption: {
            position: 'absolute',
            bottom: '100%',
        },
    }),
)

const CanvasPage = ({ state }: { state: CanvasState }) => {
    const classes = useStyles()
    const { width, height, aspect } = state.canvasSize
    const ref = useRef<HTMLCanvasElement>(null)
    const [noises, random] = useNoises(String(state.noise.seed))

    useEffect(() => {
        const context = ref.current?.getContext('2d')
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
        context.beginPath()

        const Grid = Honeycomb.defineGrid(Hex)

        const genNoiseAndDraw = (hexagon: Honeycomb.Hex<{}>) => {
            const { zoom, baseNoise, noise2Strength } = state.noise
            const [x, y] = [
                (hexagon.x - widthCount / 2 + state.noise.offsetX) / zoom,
                (hexagon.y - heightCount / 2 + state.noise.offsetY) / zoom,
            ]

            let noiseValue = noises[baseNoise](x, y)
            if (noise2Strength) {
                noiseValue += random.rnd(noise2Strength)
            }

            drawHexagon({ hexagon, noiseValue, ctx: context, state })
        }

        const { sparse } = state.grid
        const onCreate = (hex: HexWithCorrectSetDeclaration) => {
            hex.set({ q: hex.q * sparse, r: hex.r * sparse, s: hex.s * sparse })
        }
        Grid.rectangle({
            width: widthCount / sparse,
            height: heightCount / sparse,
            start: [-1, -1],
            onCreate: sparse !== 1 ? onCreate : undefined,
        }).forEach(genNoiseAndDraw)
    })

    return (
        <Container className={classes.canvasBox} maxWidth={false}>
            <Paper className={classes.paper} elevation={3}>
                <Typography
                    className={classes.sizeCaption}
                    variant="caption"
                >{`${width}x${height}    offset: ${state.noise.offsetX}:${state.noise.offsetY}`}</Typography>
                <canvas ref={ref} className={classes.canvas} width={width} height={height} />
            </Paper>
        </Container>
    )
}

export default CanvasPage
