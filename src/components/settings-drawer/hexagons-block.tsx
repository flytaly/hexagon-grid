import React, { useState, useCallback } from 'react'
import {
    Box,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Slider,
    Typography,
} from '@material-ui/core'
import throttle from 'lodash.throttle'
import { CanvasStateAction, ActionTypes, HexSettings } from '../../canvas-state'

type HexProps = {
    hexState: HexSettings
    dispatch: React.Dispatch<CanvasStateAction>
    isBigScreen: boolean
}

const HexagonsSettingsBlock = ({ hexState, dispatch, isBigScreen }: HexProps) => {
    const [hexSize, setHexSize] = useState(hexState.size)
    const setHexOptsThrottled = useCallback(
        throttle((payload: Partial<HexSettings>) => {
            dispatch({ type: ActionTypes.SET_HEX_OPTIONS, payload })
        }, 100),
        [],
    )

    return (
        <Box component="form" m={2}>
            <Typography component="div" gutterBottom>
                <Box fontWeight="fontWeightBold">Hexagons</Box>
            </Typography>
            <Typography id="hexagons_size" gutterBottom>
                Size
            </Typography>
            <Slider
                value={hexSize}
                aria-labelledby="hexagons_size"
                getAriaValueText={(value) => `${value}%`}
                step={0.5}
                marks
                min={1}
                max={20}
                valueLabelDisplay="auto"
                onChange={(e, size) => {
                    if (Array.isArray(size)) return
                    setHexSize(size)
                    if (isBigScreen) setHexOptsThrottled({ size })
                }}
                onChangeCommitted={(e, size) => {
                    if (!isBigScreen && !Array.isArray(size))
                        setHexOptsThrottled({
                            size,
                        })
                }}
            />
            <Typography>Orientation</Typography>
            <RadioGroup
                aria-label="orientation"
                name="orientation"
                value={hexState.orientation}
                onChange={(e, value) => {
                    const orientation = value === 'flat' ? 'flat' : 'pointy'
                    dispatch({
                        type: ActionTypes.SET_HEX_OPTIONS,
                        payload: { orientation },
                    })
                }}
            >
                <Grid container>
                    <Grid item>
                        <FormControlLabel value="pointy" control={<Radio />} label="pointy" />
                    </Grid>
                    <Grid item>
                        <FormControlLabel value="flat" control={<Radio />} label="flat" />
                    </Grid>
                </Grid>
            </RadioGroup>
        </Box>
    )
}

export default HexagonsSettingsBlock
