import React from 'react'
import { ArrowLeft, ArrowRight, ArrowDropDown, ArrowDropUp, Remove, Add } from '@material-ui/icons'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, IconButton, Grid } from '@material-ui/core'
import { CanvasStateAction, ActionTypes } from '../canvas-state'
import useKeyControls from '../hooks/use-key-controls'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        keysContainer: {
            position: 'absolute',
            bottom: theme.spacing(1),
            left: theme.spacing(1),
            '&:hover $key': {
                background: 'rgba(255, 255, 255, 0.7)',
            },
        },
        key: {
            background: 'rgba(255, 255, 255, 0.35)',
            borderRadius: '5px',
            margin: '1px',
            '&:active': {
                transform: 'translateY(2px)',
            },
        },
    }),
)

type ArrowKeysProps = {
    dispatch: React.Dispatch<CanvasStateAction>
}

const ArrowKeys = ({ dispatch }: ArrowKeysProps) => {
    const classes = useStyles()

    useKeyControls(dispatch)

    const dispatchOffset = (dx = 0, dy = 0) => {
        dispatch({
            type: ActionTypes.INC_NOISE_OFFSET,
            payload: { dx, dy },
        })
    }

    const dispatchHexSize = (payload: number) => {
        dispatch({ type: ActionTypes.INC_HEX_SIZE, payload })
    }

    return (
        <Box className={classes.keysContainer}>
            <Grid container direction="column" alignItems="flex-start">
                <Grid item>
                    <IconButton
                        aria-label="Increase hexagons size"
                        title="Increase hexagons size"
                        className={classes.key}
                        onClick={() => dispatchHexSize(0.5)}
                        size="small"
                        disableRipple
                    >
                        <Add />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton
                        aria-label="Decrease hexagons size"
                        title="Decrease hexagons size"
                        className={classes.key}
                        onClick={() => dispatchHexSize(-0.5)}
                        size="small"
                        disableRipple
                    >
                        <Remove />
                    </IconButton>
                </Grid>
                <Grid item style={{ alignSelf: 'center' }}>
                    <IconButton
                        aria-label="Move Top"
                        title="Move Top"
                        className={classes.key}
                        onClick={() => dispatchOffset(0, -1)}
                        size="small"
                        disableRipple
                    >
                        <ArrowDropUp />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton
                        aria-label="Move Left"
                        title="Move Left"
                        className={classes.key}
                        onClick={() => dispatchOffset(-1, 0)}
                        size="small"
                        disableRipple
                    >
                        <ArrowLeft />
                    </IconButton>
                    <IconButton
                        aria-label="Move Down"
                        title="Move Down"
                        className={classes.key}
                        onClick={() => dispatchOffset(0, 1)}
                        size="small"
                        disableRipple
                    >
                        <ArrowDropDown />
                    </IconButton>
                    <IconButton
                        aria-label="Move Right"
                        title="Move top"
                        className={classes.key}
                        onClick={() => dispatchOffset(1, 0)}
                        size="small"
                        disableRipple
                    >
                        <ArrowRight />
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ArrowKeys