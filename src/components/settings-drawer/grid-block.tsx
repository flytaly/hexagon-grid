import React, { useState } from 'react'
import { Box, Grid, Input, Slider, Typography } from '@material-ui/core'
import { CanvasStateAction, ActionTypes, GridSettings } from '../../canvas-state'

type GridSettingsProps = {
    gridState: GridSettings
    dispatch: React.Dispatch<CanvasStateAction>
}

const NoiseSettingBlock = ({ dispatch, gridState }: GridSettingsProps) => {
    const [sparse, setSparse] = useState<number>(gridState.sparse)

    const dispatchOption = (payload: Partial<GridSettings>) =>
        dispatch({ type: ActionTypes.SET_GRID_OPTIONS, payload })

    const handleSparceInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        setSparse(value)
        dispatchOption({ sparse: value })
    }

    return (
        <Box component="form" m={2}>
            <Typography component="div" gutterBottom>
                <Box fontWeight="fontWeightBold">Grid settings</Box>
            </Typography>

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
                        onChange={(e, val) => setSparse(Number(val))}
                        onChangeCommitted={(e, val) => dispatchOption({ sparse: Number(val) })}
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
        </Box>
    )
}

export default NoiseSettingBlock
