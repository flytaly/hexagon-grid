import React, { useState, useCallback } from 'react'
import {
    Box,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Slider,
    Typography,
    Input,
} from '@material-ui/core'
import throttle from 'lodash.throttle'
import { CanvasStateAction, ActionTypes, HexSettings } from '../../canvas-state-types'

type HexProps = {
    hexState: HexSettings
    dispatch: React.Dispatch<CanvasStateAction>
    isBigScreen: boolean
}

const HexagonsSettingsBlock = ({ hexState, dispatch, isBigScreen }: HexProps) => {
    const [hexSize, setHexSize] = useState(hexState.size)
    const [borderWidth, setBorderWidth] = useState(hexState.borderWidth)
    const setHexOptsThrottled = useCallback(
        throttle((payload: Partial<HexSettings>) => {
            dispatch({ type: ActionTypes.SET_HEX_OPTIONS, payload })
        }, 100),
        [],
    )
    React.useMemo(() => {
        if (hexState.size !== hexSize) {
            setHexSize(hexState.size)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hexState.size])
    const dispatchOption = (payload: Partial<HexSettings>) =>
        dispatch({ type: ActionTypes.SET_HEX_OPTIONS, payload })

    return (
        <Box component="form" m={2} onSubmit={(e) => e.preventDefault()}>
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
            <Typography id="border-width" gutterBottom>
                Border width
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <Slider
                        value={borderWidth}
                        aria-labelledby="border-width"
                        min={0}
                        max={100}
                        onChange={(e, val) => setBorderWidth(Number(val))}
                        onChangeCommitted={(e, val) => dispatchOption({ borderWidth: Number(val) })}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Input
                        value={borderWidth}
                        onChange={(event) => {
                            const value = Number(event.target.value)
                            setBorderWidth(value)
                            dispatchOption({ borderWidth: value })
                        }}
                        margin="none"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 100,
                            type: 'number',
                            'aria-labelledby': 'border-width',
                        }}
                    />
                </Grid>
            </Grid>

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
