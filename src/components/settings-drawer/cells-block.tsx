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
import {
    CanvasStateAction,
    ActionTypes,
    CellSettings,
    GridType,
} from '../../state/canvas-state-types'

type CellProps = {
    cellState: CellSettings
    dispatch: React.Dispatch<CanvasStateAction>
    isBigScreen: boolean
    type: GridType
}

const cellNames: Record<GridType, string> = {
    hexagons: 'Hexagons',
    triangles: 'Triangles',
    voronoi: 'Voronoi',
}

const CellSettingsBlock: React.FC<CellProps> = ({ cellState, dispatch, isBigScreen, type }) => {
    const [hexSize, setHexSize] = useState(cellState.size)
    const [borderWidth, setBorderWidth] = useState(cellState.borderWidth)
    const [cellVariance, setCellVariance] = useState(cellState.variance)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setCellOptsThrottled = useCallback(
        throttle((payload: Partial<CellSettings>) => {
            dispatch({ type: ActionTypes.SET_CELL_OPTIONS, payload })
        }, 100),
        [],
    )
    React.useMemo(() => {
        if (cellState.size !== hexSize) {
            setHexSize(cellState.size)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cellState.size])
    const dispatchOption = (payload: Partial<CellSettings>) =>
        dispatch({ type: ActionTypes.SET_CELL_OPTIONS, payload })

    return (
        <Box component="form" m={2} onSubmit={(e) => e.preventDefault()}>
            <Typography component="div" gutterBottom>
                <Box fontWeight="fontWeightBold">{cellNames[type]}</Box>
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
                    if (isBigScreen) setCellOptsThrottled({ size })
                }}
                onChangeCommitted={(e, size) => {
                    if (!isBigScreen && !Array.isArray(size))
                        setCellOptsThrottled({
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

            {type !== 'hexagons' ? (
                <>
                    <Typography id="cell-variance" gutterBottom>
                        Cell variance
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={9}>
                            <Slider
                                value={cellVariance}
                                aria-labelledby="cell-variance"
                                min={0}
                                max={100}
                                onChange={(e, val) => setCellVariance(Number(val))}
                                onChangeCommitted={(e, val) =>
                                    dispatchOption({ variance: Number(val) })
                                }
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Input
                                value={cellVariance}
                                onChange={(event) => {
                                    const value = Number(event.target.value)
                                    setCellVariance(value)
                                    dispatchOption({ variance: value })
                                }}
                                margin="none"
                                inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 100,
                                    type: 'number',
                                    'aria-labelledby': 'cell-variance',
                                }}
                            />
                        </Grid>
                    </Grid>
                </>
            ) : null}

            {type === 'hexagons' ? (
                <>
                    <Typography>Orientation</Typography>
                    <RadioGroup
                        aria-label="orientation"
                        name="orientation"
                        value={cellState.orientation}
                        onChange={(e, value) => {
                            const orientation = value === 'flat' ? 'flat' : 'pointy'
                            dispatch({
                                type: ActionTypes.SET_CELL_OPTIONS,
                                payload: { orientation },
                            })
                        }}
                    >
                        <Grid container>
                            <Grid item>
                                <FormControlLabel
                                    value="pointy"
                                    control={<Radio />}
                                    label="pointy"
                                />
                            </Grid>
                            <Grid item>
                                <FormControlLabel value="flat" control={<Radio />} label="flat" />
                            </Grid>
                        </Grid>
                    </RadioGroup>
                </>
            ) : null}
        </Box>
    )
}

export default CellSettingsBlock
