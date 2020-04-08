import React, { useState } from 'react'
import {
    Box,
    FormControl,
    Grid,
    IconButton,
    Input,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    Typography,
} from '@material-ui/core'
import { SwapHoriz, SwapVert } from '@material-ui/icons'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { CanvasStateAction, ActionTypes, GridSettings, GridType } from '../../canvas-state-types'

type GridSettingsProps = {
    gridState: GridSettings
    dispatch: React.Dispatch<CanvasStateAction>
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(2, 0),
            minWidth: '150px',
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
)

const GridSettingBlock = ({ dispatch, gridState }: GridSettingsProps) => {
    const classes = useStyles()
    const [sparse, setSparse] = useState<number>(gridState.sparse)
    const { signX, signY } = gridState

    const dispatchOption = (payload: Partial<GridSettings>) =>
        dispatch({ type: ActionTypes.SET_GRID_OPTIONS, payload })

    const handleSparceInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        setSparse(value)
        dispatchOption({ sparse: value })
    }

    const swapXAxis = () => dispatchOption({ signX: signX === 1 ? -1 : 1 })
    const swapYAxis = () => dispatchOption({ signY: signY === 1 ? -1 : 1 })

    return (
        <Box component="form" m={2}>
            <Typography component="div" gutterBottom>
                <Box fontWeight="fontWeightBold">Grid settings</Box>
            </Typography>

            <FormControl className={classes.formControl}>
                <InputLabel id="grid-type-label">Grid cells</InputLabel>
                <Select
                    labelId="grid-type-label"
                    value={gridState.type}
                    onChange={(ev) => {
                        dispatchOption({ type: ev.target.value as GridType })
                    }}
                >
                    {(['hexagons', 'triangles'] as GridType[]).map((t) => (
                        <MenuItem key={t} value={t}>
                            {t}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

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
                                onChange={(e, val) => setSparse(Number(val))}
                                onChangeCommitted={(e, val) =>
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
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Typography>Mirror axes</Typography>
                </Grid>
                <Grid item>
                    <IconButton
                        color={signX === -1 ? 'primary' : undefined}
                        onClick={swapXAxis}
                        aria-label="Mirror horizontal axis"
                    >
                        <SwapHoriz />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton
                        color={signY === -1 ? 'primary' : undefined}
                        onClick={swapYAxis}
                        aria-label="Mirror vertical axis"
                    >
                        <SwapVert />
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    )
}

export default GridSettingBlock
