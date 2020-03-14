import React, { useRef, useEffect } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Typography } from '@material-ui/core'
import * as Honeycomb from 'honeycomb-grid'
import SimplexNoise from 'simplex-noise'
import { CanvasState } from '../canvas-state'

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
            top: '-1.2rem',
        },
    }),
)

const CanvasPage = ({ state }: { state: CanvasState }) => {
    const classes = useStyles()
    const { width, height, aspect } = state.canvasSize
    const ref = useRef<HTMLCanvasElement>(null)
    const simplex = React.useMemo(() => {
        return new SimplexNoise(String(state.noise.seed))
    }, [state.noise.seed])

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

        Grid.rectangle({
            width: width / widthStep + 1,
            height: height / heightStep + 1,
            start: [-1, -1],
        }).forEach((hex) => {
            const point = hex.toPoint()

            const corners = hex.corners().map((corner) => corner.add(point))
            const [firstCorner, ...otherCorners] = corners

            const { zoom, hue: H, saturation: S, lightness: L } = state.noise

            /* const line = (x: number, y: number) => {
                let value = 0.0
                value += simplex.noise2D(x, 1)
                value += simplex.noise2D(y, 1)
                return value
            } */

            // const noiseV = Math.sin(simplex.noise2D(hex.q / zoom, hex.r / zoom))
            // const noiseV = Math.cos(Math.random() * 2 * Math.PI)
            const noiseV = Math.cos(1 / simplex.noise2D(hex.q / zoom, hex.r / zoom))

            // const noiseV = line(hex.q / zoom, hex.q / zoom)

            context.beginPath()
            context.moveTo(firstCorner.x, firstCorner.y)
            otherCorners.forEach(({ x, y }) => context.lineTo(x, y))
            context.lineTo(firstCorner.x, firstCorner.y)
            context.strokeStyle = 'white'
            context.lineWidth = 1
            context.stroke()
            context.fillStyle =
                noiseV > 0
                    ? `hsl(${37 + H * noiseV},${90 + S * noiseV}%, ${50 + L * noiseV}%)`
                    : `hsl(${214 + H * noiseV},${70 + S * noiseV}%, ${40 + L * noiseV}%)`

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
                >{`${width}x${height}`}</Typography>
                <canvas ref={ref} className={classes.canvas} width={width} height={height} />
            </Paper>
        </Container>
    )
}

export default CanvasPage
