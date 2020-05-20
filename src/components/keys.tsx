import React from 'react'
import {
    ArrowLeft,
    ArrowRight,
    ArrowDropDown,
    ArrowDropUp,
    Remove,
    Add,
    Share,
} from '@material-ui/icons'
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import { Box, IconButton, Fab, Grid } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { CanvasStateAction, ActionTypes } from '../canvas-state-types'
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
        exportBtn: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(3),
            // borderTopRightRadius: 0,
            // borderBottomRightRadius: 0,
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
        key: {
            background: 'rgba(255, 255, 255, 0.35)',
            borderRadius: '5px',
            margin: '2px',
            '&:active': {
                transform: 'translateY(2px)',
            },
        },
    }),
)

type ArrowKeysProps = {
    dispatch: React.Dispatch<CanvasStateAction>
    exportBtnClickHandler: () => void
}

const ArrowKeys: React.FC<ArrowKeysProps> = ({ dispatch, exportBtnClickHandler }) => {
    const classes = useStyles()
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('md'))

    useKeyControls(dispatch)

    const dispatchOffset = (dx = 0, dy = 0) => {
        dispatch({
            type: ActionTypes.INC_NOISE_OFFSET,
            payload: { dx, dy },
        })
    }

    const dispatchHexSize = (payload: number) => {
        dispatch({ type: ActionTypes.INC_CELL_SIZE, payload })
    }

    return (
        <>
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
            <Fab
                variant="extended"
                size={matches ? 'medium' : 'small'}
                color="primary"
                aria-label="export image"
                className={classes.exportBtn}
                onClick={exportBtnClickHandler}
            >
                <Share className={classes.extendedIcon} />
                Export
            </Fab>
        </>
    )
}

export default ArrowKeys
