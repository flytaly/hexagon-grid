import React, { useState, useMemo } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
    Box,
    Button,
    IconButton,
    Grid,
    Typography,
    Popover,
    Divider,
    FormGroup,
    FormControlLabel,
    Switch,
} from '@material-ui/core'
import { SketchPicker, HSLColor, ColorResult } from 'react-color'
import { CheckCircleRounded } from '@material-ui/icons'
import { makePaletteColors } from '../../canvas-state'
import { ColorsSettings, CanvasStateAction, ActionTypes } from '../../canvas-state-types'
import { toHslaStr } from '../../helpers'
import { defaultPalettes } from '../../palettes'
import { checkered } from '../../background'
import CustomPaletteMaker from './add-custom-palette'

const ColorButton = withStyles(({ palette }) => ({
    root: {
        border: '1px solid grey',
        borderRadius: '3px',
        height: '24px',
        padding: 0,
        width: '40px',
        minWidth: '40px',
        '&:hover, &:focus': { opacity: 0.6 },
        '&:focus': {
            outline: `2px solid ${palette.primary.main}`,
            outlineOffset: '1px',
        },
    },
}))(IconButton)

const PaletteButton = withStyles(({ palette, spacing }) => ({
    root: {
        position: 'relative',
        border: '1px solid grey',
        borderRadius: '5px',
        height: '28px',
        padding: 0,
        width: '100%',
        margin: spacing(0, 0, 1, 0),
        '&:hover, &:focus': { opacity: 0.6 },
        '&:focus': {
            outline: `2px solid ${palette.primary.main}`,
            outlineOffset: '1px',
        },
    },
}))(IconButton)

type ColorProps = {
    colorState: ColorsSettings
    dispatch: React.Dispatch<CanvasStateAction>
}

const ColorBlock = ({ dispatch, colorState }: ColorProps) => {
    const [border, setBorder] = useState<HSLColor>(colorState.border)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [bordAnchorEl, setBordAnchorEl] = React.useState<HTMLButtonElement | null>(null)

    const [bgColor, setBgColor] = useState<HSLColor | null>(colorState.background)
    const [bgAnchorEl, setBgAnchorEl] = React.useState<HTMLButtonElement | null>(null)

    const paletteColors = useMemo(
        () => Array.from(new Set(colorState.palette.colors.map((c) => toHslaStr(c.hsl)))),
        [colorState.palette.colors],
    )

    const handleNoFillChange = () => {
        dispatch({ type: ActionTypes.SET_COLOR_OPTIONS, payload: { noFill: !colorState.noFill } })
    }

    return (
        <>
            <Box component="form" m={2}>
                <Typography component="div" gutterBottom>
                    <Box fontWeight="fontWeightBold">Colors</Box>
                </Typography>
                {colorState.noFill ? null : (
                    <Grid container spacing={2}>
                        <Grid item xs={9}>
                            <Typography>Cell border</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <ColorButton
                                onClick={(e) => setBordAnchorEl(e.currentTarget)}
                                aria-label="Hexagon border color"
                                size="small"
                                disableRipple
                                style={{
                                    background: border.a ? toHslaStr(border) : checkered,
                                }}
                            >
                                <div />
                            </ColorButton>
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
                    <SketchPicker
                        color={border}
                        onChange={(color) => setBorder(color.hsl)}
                        presetColors={paletteColors}
                        onChangeComplete={(color: ColorResult) =>
                            dispatch({
                                type: ActionTypes.SET_COLOR_OPTIONS,
                                payload: { border: color.hsl },
                            })
                        }
                    />
                </Popover>
                <Grid container spacing={2}>
                    <Grid item xs={9}>
                        <Typography>Background</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <ColorButton
                            onClick={(e) => setBgAnchorEl(e.currentTarget)}
                            aria-label="Background color"
                            size="small"
                            disableRipple
                            style={{
                                background:
                                    bgColor && bgColor.a !== 0 ? toHslaStr(bgColor) : checkered,
                            }}
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
                >
                    <SketchPicker
                        color={bgColor || { h: 0, s: 0, l: 1, a: 0 }}
                        presetColors={paletteColors}
                        onChange={(color) => setBgColor(color.hsl)}
                        onChangeComplete={(color: ColorResult) =>
                            dispatch({
                                type: ActionTypes.SET_COLOR_OPTIONS,
                                payload: { background: color.hsl },
                            })
                        }
                    />
                </Popover>
                <FormGroup row style={{ margin: 0 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={Boolean(colorState.noFill)}
                                onChange={handleNoFillChange}
                                color="primary"
                            />
                        }
                        label="fill only borders"
                        title="Don't fill cell's body"
                    />
                </FormGroup>
            </Box>
            <Box component="form" m={2}>
                <Typography component="div" gutterBottom>
                    <Box fontWeight="fontWeightBold">Palettes</Box>
                </Typography>
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
                        >
                            + add color palette
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
                <Divider flexItem />
                <Divider flexItem />
                {colorState.customPalettes.map((p) => (
                    <PaletteButton
                        key={p.id}
                        aria-label={`custom palette ${p.id}`}
                        disableRipple
                        onClick={() => {
                            dispatch({
                                type: ActionTypes.SET_COLOR_OPTIONS,
                                payload: {
                                    palette: {
                                        isCustom: true,
                                        id: p.id,
                                        colors: makePaletteColors(p.colors, p.id),
                                    },
                                },
                            })
                        }}
                        style={{
                            background: `linear-gradient(to right, ${p.gradient}), ${checkered}`,
                            ...(colorState.palette.id === p.id && { border: '2px solid black' }),
                        }}
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
                        onClick={() => {
                            dispatch({
                                type: ActionTypes.SET_COLOR_OPTIONS,
                                payload: {
                                    palette: {
                                        isCustom: false,
                                        id: p.id,
                                        colors: makePaletteColors(p.colors, p.id),
                                    },
                                    ...(p.setBackground && { background: p.setBackground }),
                                },
                            })
                            if (p.setBackground) setBgColor(p.setBackground)
                        }}
                        style={{
                            background: `linear-gradient(to right, ${p.gradient}), ${checkered}`,
                            ...(colorState.palette.id === p.id && { border: '2px solid black' }),
                        }}
                    >
                        {colorState.palette.id === p.id ? <CheckCircleRounded /> : null}
                    </PaletteButton>
                ))}
            </Box>
        </>
    )
}

export default ColorBlock
