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
        return new SimplexNoise('3')
    }, [])

    useEffect(() => {
        const canvas = ref.current
        const context = canvas?.getContext('2d')
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

            const coef = 40
            const c_H = 2
            const c_S = 3
            const c_L = 1
            const noiseV = simplex.noise2D(hex.q / coef, hex.r / coef)
            const noise2 = simplex.noise3D(hex.q / coef, hex.r / coef, (-hex.q - hex.r) / coef)

            context.beginPath()
            context.moveTo(firstCorner.x, firstCorner.y)
            otherCorners.forEach(({ x, y }) => context.lineTo(x, y))
            context.lineTo(firstCorner.x, firstCorner.y)
            context.strokeStyle = 'white'
            context.lineWidth = 1
            context.stroke()
            context.fillStyle =
                noiseV > 0
                    ? `hsl(${37 + c_H * noiseV},${90 + c_S * noiseV}%, ${50 + c_L * noiseV}%)`
                    : `hsl(${214 + c_H * noiseV},${70 + c_S * noiseV}%, ${40 + c_L * noiseV}%)`

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
