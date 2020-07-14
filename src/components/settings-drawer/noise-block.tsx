import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
    Box,
    Button,
    Grid,
    Input,
    Slider,
    Typography,
    InputLabel,
    Select,
    FormControl,
    MenuItem,
} from '@material-ui/core'
import {
    RecursivePartial,
    NoiseSettings,
    CanvasStateAction,
    ActionTypes,
} from '../../state/canvas-state-types'
import { Noises2D, Noises2DList, Noises2DFns } from '../../noises'
import { genSeed } from '../../helpers'

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

type NoiseProps = {
    noiseState: NoiseSettings
    dispatch: React.Dispatch<CanvasStateAction>
}

const NoiseSettingBlock: React.FC<NoiseProps> = ({ dispatch, noiseState }) => {
    const classes = useStyles()
    const [n2Strength, setN2Strength] = useState<number>(noiseState.noise2Strength)
    const [zoom, setZoom] = useState<number>(noiseState.zoom)
    const [hue, setHue] = useState<number>(noiseState.hue)
    const [saturation, setSaturation] = useState<number>(noiseState.saturation)
    const [lightness, setLightness] = useState<number>(noiseState.lightness)

    const dispatchOption = (payload: RecursivePartial<NoiseSettings>) =>
        dispatch({ type: ActionTypes.SET_NOISE_OPTIONS, payload })

    const handleExpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const expr = event.target.value
        dispatchOption({
            baseNoise: {
                id: 'custom',
                customFn: expr,
            },
        })
    }

    const handleN2InputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        setN2Strength(value)
        dispatchOption({ noise2Strength: value })
    }
    const handleZoomInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        setZoom(value)
        dispatchOption({ zoom: value })
    }
    const handleHueInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        setHue(value)
        dispatchOption({ hue: value })
    }
    const handleSaturationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        setSaturation(value)
        dispatchOption({ saturation: value })
    }
    const handleLightnessInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        setLightness(value)
        dispatchOption({ lightness: value })
    }

    return (
        <Box component="form" m={2}>
            <Typography component="div" gutterBottom>
                <Box fontWeight="fontWeightBold">Noise settings</Box>
            </Typography>

            <FormControl className={classes.formControl}>
                <InputLabel id="base-noise-label">Base noise</InputLabel>
                <Select
                    labelId="base-noise-label"
                    value={noiseState.baseNoise.id}
                    onChange={(ev) => {
                        dispatchOption({
                            baseNoise: { id: ev.target.value as keyof Noises2DFns },
                            offsetX: 0,
                            offsetY: 0,
                        })
                    }}
                >
                    {Noises2DList.map((id) => (
                        <MenuItem key={id} value={id}>
                            {Noises2D[id].name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {noiseState.baseNoise.id === 'custom' ? (
                <Box display="flex" flexDirection="column" mb={2}>
                    <Typography variant="caption">
                        Enter math expression. Allowed variables: x, y, w (width), h (height)
                    </Typography>
                    <Input value={noiseState.baseNoise.customFn} onChange={handleExpChange} />
                </Box>
            ) : null}

            {noiseState.baseNoise.id === 'image' ? (
                <Box display="flex" flexDirection="column" mb={2}>
                    <Typography gutterBottom>Load image</Typography>
                    <input
                        type="file"
                        onChange={(e) => {
                            let reader
                            const input = e.target

                            if (input.files && input.files[0]) {
                                reader = new FileReader()

                                reader.onload = (ev) => {
                                    dispatchOption({
                                        imageDataString: ev?.target?.result as string,
                                    })
                                }

                                reader.readAsDataURL(input.files[0])
                            }
                        }}
                    />
                </Box>
            ) : null}

            <Typography id="random-noise" gutterBottom>
                Second noise strength (0 = disable)
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <Slider
                        value={n2Strength}
                        aria-labelledby="random-noise"
                        step={0.05}
                        min={0}
                        max={1}
                        onChange={(e, val) => setN2Strength(Number(val))}
                        onChangeCommitted={(e, val) =>
                            dispatchOption({ noise2Strength: Number(val) })
                        }
                    />
                </Grid>
                <Grid item xs={3}>
                    <Input
                        value={n2Strength}
                        onChange={handleN2InputChange}
                        margin="dense"
                        inputProps={{
                            step: 0.05,
                            min: 0,
                            max: 1,
                            type: 'number',
                            'aria-labelledby': 'random-noise',
                        }}
                    />
                </Grid>
            </Grid>
            {noiseState.baseNoise.id === 'image' ? null : (
                <>
                    <Typography id="zoom-factor" gutterBottom>
                        Zoom Factor
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={9}>
                            <Slider
                                value={zoom}
                                aria-labelledby="zoom-factor"
                                min={1}
                                max={70}
                                onChange={(e, val) => setZoom(Number(val))}
                                onChangeCommitted={(e, val) =>
                                    dispatchOption({ zoom: Number(val) })
                                }
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Input
                                value={zoom}
                                onChange={handleZoomInputChange}
                                margin="dense"
                                inputProps={{
                                    step: 1,
                                    min: 1,
                                    max: 50,
                                    type: 'number',
                                    'aria-labelledby': 'zoom-factor',
                                }}
                            />
                        </Grid>
                    </Grid>
                </>
            )}
            <Typography id="hue-factor" gutterBottom>
                Hue Variance
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <Slider
                        value={hue}
                        aria-labelledby="hue-factor"
                        min={0}
                        max={360}
                        onChange={(e, val) => setHue(Number(val))}
                        onChangeCommitted={(e, val) => dispatchOption({ hue: Number(val) })}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Input
                        value={hue}
                        onChange={handleHueInputChange}
                        margin="dense"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 360,
                            type: 'number',
                            'aria-labelledby': 'hue-factor',
                        }}
                    />
                </Grid>
            </Grid>

            <Typography id="saturation-factor" gutterBottom>
                Saturation Variance
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <Slider
                        value={saturation}
                        aria-labelledby="saturation-factor"
                        min={0}
                        max={100}
                        onChange={(e, val) => setSaturation(Number(val))}
                        onChangeCommitted={(e, val) => dispatchOption({ saturation: Number(val) })}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Input
                        value={saturation}
                        onChange={handleSaturationInputChange}
                        margin="dense"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 100,
                            type: 'number',
                            'aria-labelledby': 'saturation-factor',
                        }}
                    />
                </Grid>
            </Grid>

            <Typography id="saturation-factor" gutterBottom>
                Lightness Variance
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <Slider
                        value={lightness}
                        aria-labelledby="lightness-factor"
                        min={0}
                        max={100}
                        onChange={(e, val) => setLightness(Number(val))}
                        onChangeCommitted={(e, val) => dispatchOption({ lightness: Number(val) })}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Input
                        value={lightness}
                        onChange={handleLightnessInputChange}
                        margin="dense"
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 100,
                            type: 'number',
                            'aria-labelledby': 'lightness-factor',
                        }}
                    />
                </Grid>
            </Grid>
            <Button
                color="primary"
                variant="outlined"
                size="small"
                onClick={() => dispatchOption({ seed: genSeed() })}
            >
                Generate noise seed
            </Button>
        </Box>
    )
}

export default NoiseSettingBlock
