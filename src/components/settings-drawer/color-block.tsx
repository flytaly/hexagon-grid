import { Add, CheckCircleRounded, Shuffle } from '@mui/icons-material'
import {
    Box,
    Button,
    Divider,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    IconButtonProps,
    Popover,
    styled,
    Switch,
    Typography,
} from '@mui/material'
import React, { CSSProperties, useMemo, useState } from 'react'

import { checkered } from '#/background'
import ColorPicker, { ColorButton } from '#/components/color-picker'
import { toRGBAStr } from '#/helpers'
import { ColorPalette, defaultPalettes, getNicePalette } from '#/palettes'
import { makePaletteColors } from '#/state/canvas-state'
import { ActionTypes, CanvasStateAction, ColorsSettings } from '#/state/canvas-state-types'
import CustomPaletteMaker from './add-custom-palette'

const PaletteButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
    position: 'relative',
    border: '1px solid grey',
    borderRadius: '5px',
    height: '28px',
    padding: 0,
    width: '100%',
    margin: theme.spacing(0, 0, 1, 0),
    '&:hover, &:focus': { opacity: 0.6 },
    '&:focus': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: '1px',
    },
}))

type ColorProps = {
    colorState: ColorsSettings
    dispatch: React.Dispatch<CanvasStateAction>
}

function ColorBlock({ dispatch, colorState }: ColorProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [bordAnchorEl, setBordAnchorEl] = useState<HTMLButtonElement | null>(null)
    const [bgAnchorEl, setBgAnchorEl] = React.useState<HTMLButtonElement | null>(null)

    const paletteColors = useMemo(
        () => Array.from(new Set(colorState.palette.colors.map((c) => toRGBAStr(c.rgb)))),
        [colorState.palette.colors],
    )
    const handleNoFillChange = () => {
        dispatch({ type: ActionTypes.SET_COLOR_OPTIONS, payload: { noFill: !colorState.noFill } })
    }

    const handleBordFillChange = () => {
        dispatch({
            type: ActionTypes.SET_COLOR_OPTIONS,
            payload: { useBodyColor: !colorState.useBodyColor },
        })
    }

    const handleIsGradientChange = () => {
        dispatch({
            type: ActionTypes.TOGGLE_GRADIENT,
        })
    }

    const generatePaletteHandler = () => {
        if (!isModalOpen) {
            setIsModalOpen(true)
        }
        dispatch({
            type: ActionTypes.MODIFY_PALETTE,
            payload: getNicePalette(),
        })
    }

    const getGradientBg = (p: ColorPalette) => {
        const st: CSSProperties = {}
        if (p.colors.length > 1) {
            const grad = !colorState.isGradient ? p.gradient : p.colors.map((c) => toRGBAStr(c))
            st.background = `linear-gradient(to right, ${grad}), ${checkered}`
        } else {
            st.background = checkered
            st.backgroundColor = toRGBAStr(p.colors[0])
        }
        if (colorState.palette.id === p.id) st.border = '2px solid black'
        return st
    }

    const paletteBtnClick = (p: ColorPalette, isCustom = false) => {
        dispatch({
            type: ActionTypes.SET_COLOR_OPTIONS,
            payload: {
                palette: {
                    isCustom,
                    id: p.id,
                    colors: makePaletteColors(p.colors, p.id),
                },
                ...(p.setBackground && { background: p.setBackground }),
            },
        })
    }

    return (
        <>
            <Box component="form" m={2}>
                <Typography component="div" gutterBottom>
                    <Box fontWeight="fontWeightBold">Colors</Box>
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={9}>
                        <Typography>Background</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <ColorButton
                            onClick={(e) => setBgAnchorEl(e.currentTarget)}
                            aria-label="Background color"
                            disableRipple
                            bgcolor={toRGBAStr(colorState.background || { r: 0, g: 0, b: 0, a: 1 })}
                            sx={{ width: '2.5rem', height: '1.5rem' }}
                        />
                    </Grid>
                </Grid>
                <Popover
                    id="bg-color-picker"
                    open={Boolean(bgAnchorEl)}
                    anchorEl={bgAnchorEl}
                    onClose={() => {
                        setBgAnchorEl(null)
                    }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{ background: 'none', backgroundColor: 'none' }}
                >
                    <ColorPicker
                        color={colorState.background || { r: 0, g: 0, b: 0, a: 1 }}
                        onChange={(background) => {
                            dispatch({
                                type: ActionTypes.SET_COLOR_OPTIONS,
                                payload: { background },
                            })
                        }}
                        presetColors={paletteColors}
                    />
                </Popover>

                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={Boolean(colorState.useBodyColor)}
                                onChange={handleBordFillChange}
                                color="primary"
                            />
                        }
                        label="fill borders in cell's colors"
                        title="Fill border and cell with the same color"
                    />
                </FormGroup>
                {colorState.useBodyColor ? null : (
                    <Grid container spacing={2}>
                        <Grid item xs={9}>
                            <Typography>Cell border</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ColorButton
                                onClick={(e) => setBordAnchorEl(e.currentTarget)}
                                aria-label="Hexagon border color"
                                disableRipple
                                bgcolor={
                                    colorState.border.a ? toRGBAStr(colorState.border) : checkered
                                }
                                sx={{ width: '2.5rem', height: '1.5rem' }}
                            />
                        </Grid>
                    </Grid>
                )}
                <Popover
                    id="border-color-picker"
                    open={Boolean(bordAnchorEl)}
                    anchorEl={bordAnchorEl}
                    onClose={() => {
                        setBordAnchorEl(null)
                    }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <ColorPicker
                        color={colorState.border}
                        onChange={(border) => {
                            dispatch({
                                type: ActionTypes.SET_COLOR_OPTIONS,
                                payload: { border },
                            })
                        }}
                        presetColors={paletteColors}
                    />
                </Popover>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!colorState.noFill}
                                onChange={handleNoFillChange}
                                color="primary"
                            />
                        }
                        label="fill cell's body"
                        title="fill cell's body"
                    />
                </FormGroup>
            </Box>
            <Box component="form" m={2}>
                <Typography component="div" gutterBottom>
                    <Box fontWeight="fontWeightBold">Palettes</Box>
                </Typography>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={colorState.isGradient}
                                onChange={handleIsGradientChange}
                                color="primary"
                            />
                        }
                        label="gradient"
                        title="Make smooth gradient between colors"
                    />
                </FormGroup>
                <Box mb={1}>
                    {!isModalOpen && (
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            fullWidth
                            onClick={() => {
                                setIsModalOpen(!isModalOpen)
                            }}
                            startIcon={<Add />}
                        >
                            edit color palette
                        </Button>
                    )}
                    {isModalOpen && (
                        <CustomPaletteMaker
                            isOpen={isModalOpen}
                            handleClose={() => {
                                setIsModalOpen(false)
                            }}
                            dispatch={dispatch}
                            colorState={colorState}
                        />
                    )}
                </Box>
                <Box mb={1}>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        fullWidth
                        onClick={generatePaletteHandler}
                        startIcon={<Shuffle />}
                    >
                        generate palette
                    </Button>
                </Box>
                <Divider flexItem />
                <Divider flexItem />
                {colorState.customPalettes.map((p) => (
                    <PaletteButton
                        key={p.id}
                        aria-label={`custom palette ${p.id}`}
                        disableRipple
                        onClick={() => paletteBtnClick(p, true)}
                        style={getGradientBg(p)}
                    >
                        {colorState.palette.id === p.id ? <CheckCircleRounded /> : null}
                    </PaletteButton>
                ))}
                <Divider />
                {defaultPalettes.map((p) => (
                    <PaletteButton
                        key={p.id}
                        aria-label={p.name}
                        disableRipple
                        onClick={() => paletteBtnClick(p)}
                        style={getGradientBg(p)}
                        title={p.name}
                    >
                        {colorState.palette.id === p.id ? <CheckCircleRounded /> : null}
                    </PaletteButton>
                ))}
            </Box>
        </>
    )
}

export default ColorBlock
