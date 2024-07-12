import { Rotate90DegreesCcw, SwapHoriz, SwapVert } from '@mui/icons-material'
import { Box, Grid, IconButton, Input, Slider, Typography } from '@mui/material'
import React from 'react'

import HexIcon from '#/assets/hex-grid.svg?react'
import TriangleIcon from '#/assets/triangle.svg?react'
import VoronoiIcon from '#/assets/voronoi.svg?react'
import useProxyState from '#/hooks/use-proxy-state'
import { ActionTypes, CanvasStateAction, GridSettings, GridType } from '#/state/canvas-state-types'

type GridSettingsProps = {
    gridState: GridSettings
    dispatch: React.Dispatch<CanvasStateAction>
}

function GridSettingBlock({ dispatch, gridState }: GridSettingsProps) {
    const [sparse, setSparse] = useProxyState<number>(gridState.sparse)
    const { signX, signY, isXYSwapped } = gridState

    const dispatchOption = (payload: Partial<GridSettings>) =>
        dispatch({ type: ActionTypes.SET_GRID_OPTIONS, payload })

    const handleSparceInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        setSparse(value)
        dispatchOption({ sparse: value })
    }

    const setGridType = (type: GridType) => dispatchOption({ type })
    const mirrorXAxis = () => dispatchOption({ signX: signX === 1 ? -1 : 1 })
    const mirrorYAxis = () => dispatchOption({ signY: signY === 1 ? -1 : 1 })
    const swapXYAxes = () => dispatchOption({ isXYSwapped: !isXYSwapped })

    return (
        <Box component="form" m={2}>
            <Typography component="div" gutterBottom>
                <Box fontWeight="fontWeightBold">Grid settings</Box>
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Typography>Axes</Typography>
                </Grid>
                <Grid item>
                    <IconButton
                        color={signX === -1 ? 'primary' : undefined}
                        onClick={mirrorXAxis}
                        aria-label="Mirror horizontal axis"
                        title="Mirror horizontal axis"
                        size="large"
                    >
                        <SwapHoriz />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton
                        color={signY === -1 ? 'primary' : undefined}
                        onClick={mirrorYAxis}
                        aria-label="Mirror vertical axis"
                        title="Mirror vertical axis"
                        size="large"
                    >
                        <SwapVert />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton
                        color={isXYSwapped ? 'primary' : undefined}
                        onClick={swapXYAxes}
                        aria-label="Swap axes"
                        title="Swap axes"
                        size="large"
                    >
                        <Rotate90DegreesCcw />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Typography>Grid cells</Typography>
                </Grid>
                <Grid item>
                    <IconButton
                        color={gridState.type === 'hexagons' ? 'primary' : undefined}
                        onClick={() => {
                            setGridType('hexagons')
                        }}
                        aria-label="Hexagon grid"
                        size="large"
                    >
                        <HexIcon height="1em" width="1em" title="hexagons" />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton
                        color={gridState.type === 'triangles' ? 'primary' : undefined}
                        onClick={() => {
                            setGridType('triangles')
                        }}
                        aria-label="Triangle grid"
                        size="large"
                    >
                        <TriangleIcon height="1em" width="1em" title="triangles" />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton
                        color={gridState.type === 'voronoi' ? 'primary' : undefined}
                        onClick={() => {
                            setGridType('voronoi')
                        }}
                        aria-label="Voronoi grid"
                        size="large"
                    >
                        <VoronoiIcon height="1em" width="1em" title="Voronoi" />
                    </IconButton>
                </Grid>
            </Grid>
            {gridState.type === 'hexagons' ? (
                <>
                    <Typography id="sparce-factor" gutterBottom>
                        Sparce Factor
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={9}>
                            <Slider
                                value={sparse}
                                aria-labelledby="sparse-factor"
                                step={0.05}
                                min={1}
                                max={3}
                                onChange={(_, val) => setSparse(Number(val))}
                                onChangeCommitted={(_, val) =>
                                    dispatchOption({ sparse: Number(val) })
                                }
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Input
                                value={sparse}
                                onChange={handleSparceInputChange}
                                margin="dense"
                                inputProps={{
                                    step: 0.05,
                                    min: 1,
                                    max: 3,
                                    type: 'number',
                                    'aria-labelledby': 'sparse-factor',
                                }}
                            />
                        </Grid>
                    </Grid>
                </>
            ) : null}
        </Box>
    )
}

export default GridSettingBlock
