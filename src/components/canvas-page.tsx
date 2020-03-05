import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Container, Paper, Typography } from '@material-ui/core'
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
            top: '-1rem',
        },
    }),
)

const CanvasPage = ({ state }: { state: CanvasState }) => {
    const classes = useStyles()

    return (
        <Container className={classes.canvasBox} maxWidth="sm">
            <Paper className={classes.paper} elevation={3}>
                <Typography
                    className={classes.sizeCaption}
                    variant="caption"
                >{`${state.size.width}x${state.size.height}`}</Typography>
                <canvas
                    className={classes.canvas}
                    width={state.size.width}
                    height={state.size.height}
                />
            </Paper>
        </Container>
    )
}

export default CanvasPage
