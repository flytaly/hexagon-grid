import {
    Add,
    ArrowDropDown,
    ArrowDropUp,
    ArrowLeft,
    ArrowRight,
    Remove,
    Share,
} from '@mui/icons-material'
import { Box, Fab, Grid, IconButton, IconButtonProps, Stack } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import React from 'react'

import { ActionTypes, CanvasStateAction } from '#/state/canvas-state-types'

type ArrowKeysProps = {
    dispatch: React.Dispatch<CanvasStateAction>
    exportBtnClickHandler: () => void
}

const Key = styled(IconButton)<IconButtonProps>(() => ({
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '5px',
    margin: '2px',
    '&:active': {
        transform: 'translateY(2px)',
    },
}))

function ArrowKeys({ dispatch, exportBtnClickHandler }: ArrowKeysProps) {
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('md'))

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
            <Box
                sx={{
                    position: 'absolute',
                    bottom: theme.spacing(1),
                    left: theme.spacing(1),
                    '&:hover .control-key': {
                        background: 'rgba(255, 255, 255, 0.8)',
                    },
                }}
            >
                <Grid container direction="column" alignItems="flex-start">
                    <Grid item>
                        <Key
                            className="control-key"
                            aria-label="Increase hexagons size"
                            title="Increase hexagons size"
                            onClick={() => dispatchHexSize(0.5)}
                            size="small"
                            disableRipple
                        >
                            <Add />
                        </Key>
                    </Grid>
                    <Grid item>
                        <Key
                            className="control-key"
                            aria-label="Decrease hexagons size"
                            title="Decrease hexagons size"
                            onClick={() => dispatchHexSize(-0.5)}
                            size="small"
                            disableRipple
                        >
                            <Remove />
                        </Key>
                    </Grid>
                    <Grid item style={{ alignSelf: 'center' }}>
                        <Key
                            className="control-key"
                            aria-label="Move Top"
                            title="Move Top"
                            onClick={() => dispatchOffset(0, -1)}
                            size="small"
                            disableRipple
                        >
                            <ArrowDropUp />
                        </Key>
                    </Grid>
                    <Grid item>
                        <Key
                            className="control-key"
                            aria-label="Move Left"
                            title="Move Left"
                            onClick={() => dispatchOffset(-1, 0)}
                            size="small"
                            disableRipple
                        >
                            <ArrowLeft />
                        </Key>
                        <Key
                            className="control-key"
                            aria-label="Move Down"
                            title="Move Down"
                            onClick={() => dispatchOffset(0, 1)}
                            size="small"
                            disableRipple
                        >
                            <ArrowDropDown />
                        </Key>
                        <Key
                            className="control-key"
                            aria-label="Move Right"
                            title="Move top"
                            onClick={() => dispatchOffset(1, 0)}
                            size="small"
                            disableRipple
                        >
                            <ArrowRight />
                        </Key>
                    </Grid>
                </Grid>
            </Box>
            <Fab
                variant="extended"
                size={matches ? 'medium' : 'small'}
                color="primary"
                aria-label="export image"
                sx={{
                    position: 'absolute',
                    bottom: theme.spacing(2),
                    right: theme.spacing(3),
                }}
                onClick={exportBtnClickHandler}
            >
                <Stack direction="row" gap={1}>
                    <Share />
                    Export
                </Stack>
            </Fab>
        </>
    )
}

export default ArrowKeys
