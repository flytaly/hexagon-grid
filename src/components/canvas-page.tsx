import React, { useRef, useEffect } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Typography } from '@material-ui/core'
import * as Honeycomb from 'honeycomb-grid'
import { CanvasState } from '../canvas-state'
import { useNoises } from '../hooks/use-noises'

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
    const noises = useNoises(String(state.noise.seed))

    useEffect(() => {
        const context = ref.current?.getContext('2d')
        if (!context || !state.canvasSize.wasMeasured) return

        const hexSize =
            aspect < 1
                ? (state.hex.size * height * aspect) / 100
                : (state.hex.size * width) / aspect / 100
        const Hex = Honeycomb.extendHex({ size: hexSize, orientation: state.hex.orientation })

        const widthStep =
            state.hex.orientation === 'pointy' ? hexSize * Math.sqrt(3) : hexSize * 1.5
        const heightStep =
            state.hex.orientation === 'pointy' ? hexSize * 1.5 : hexSize * Math.sqrt(3)
        context.clearRect(0, 0, width, height)
        context.beginPath()
        const Grid = Honeycomb.defineGrid(Hex)

        const widthCount = width / widthStep + 1
        const heightCount = height / heightStep + 1

        Grid.rectangle({
            width: widthCount,
            height: heightCount,
            start: [-1, -1],
        }).forEach((hex) => {
            const point = hex.toPoint()

            const corners = hex.corners().map((corner) => corner.add(point))
            const [firstCorner, ...otherCorners] = corners

            const { zoom, hue: H, saturation: S, lightness: L } = state.noise
            const [x, y] = [
                (hex.x - widthCount / 2 + state.noise.offsetX) / zoom,
                (hex.y - heightCount / 2 + state.noise.offsetY) / zoom,
            ]

            // let noiseValue = noises.simplex(x, y)
            let noiseValue = noises.cubic(x, y * aspect)
            noiseValue += noises.rnd(0.4)

            context.beginPath()
            context.moveTo(firstCorner.x, firstCorner.y)
            otherCorners.forEach((c) => context.lineTo(c.x, c.y))
            context.lineTo(firstCorner.x, firstCorner.y)
            if (state.hex.borderWidth) {
                context.strokeStyle = 'white'
                context.lineWidth = state.hex.borderWidth
                context.stroke()
            }
            context.fillStyle =
                noiseValue > 0
                    ? `hsl(${37 + H * noiseValue},${90 + S * noiseValue}%, ${50 + L * noiseValue}%)`
                    : `hsl(${214 + H * noiseValue},${70 + S * noiseValue}%, ${40 +
                          L * noiseValue}%)`

            // hsl(37, 94%, 53%)
            // hsl(214, 69%, 39%)
            // context.fillStyle = `hsl(${30},50%,${value2d > 0 ? 100 : 0}%)`
            context.fill()
        })
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
