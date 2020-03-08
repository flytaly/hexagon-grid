import React, { useRef, useEffect } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Typography } from '@material-ui/core'
import * as Honeycomb from 'honeycomb-grid'
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

    useEffect(() => {
        const canvas = ref.current
        const context = canvas?.getContext('2d')
        if (!context || !state.canvasSize.wasMeasured) return
        context.clearRect(0, 0, width, height)

        const hexSize =
            aspect < 1
                ? (state.hex.size * height * aspect) / 100
                : (state.hex.size * width) / aspect / 100
        const Hex = Honeycomb.extendHex({ size: hexSize })

        const Grid = Honeycomb.defineGrid(Hex)
        Grid.rectangle({ width: width / hexSize, height: height / hexSize }).forEach((hex) => {
            const point = hex.toPoint()
            const corners = hex.corners().map((corner) => corner.add(point))
            const [firstCorner, ...otherCorners] = corners

            // // move the "pen" to the first corner
            context.beginPath()
            context.moveTo(firstCorner.x, firstCorner.y)
            otherCorners.forEach(({ x, y }) => context.lineTo(x, y))
            context.lineTo(firstCorner.x, firstCorner.y)
            context.stroke()
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
