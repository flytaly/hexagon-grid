import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Box, IconButton, Grid, Typography, Popover } from '@material-ui/core'
import { ChromePicker, HSLColor, ColorResult } from 'react-color'
import { CheckTwoTone } from '@material-ui/icons'
import { ColorsSettings, CanvasStateAction, ActionTypes } from '../../canvas-state'
import { toHslaStr } from '../../helpers'
import { defaultPalettes } from '../../palettes'
import { checkered } from '../../background'

const ColorButton = withStyles(({ palette }) => ({
    root: {
        border: '1px solid grey',
        borderRadius: '3px',
        height: '20px',
        width: '40px',
        minWidth: '40px',
        '&:hover, &:focus': { opacity: 0.6 },
        '&:focus': {
            outline: '2px solid',
            outlineColor: palette.primary.main,
        },
    },
}))(IconButton)

const PaletteButton = withStyles(({ palette, spacing }) => ({
    root: {
        border: '1px solid grey',
        borderRadius: '5px',
        height: '20px',
        width: '100%',
        margin: spacing(0, 0, 1, 0),
        position: 'relative',
        '&:hover, &:focus': { opacity: 0.6 },
        '&:focus': {
            outline: '2px solid',
            outlineColor: palette.primary.main,
        },
    },
}))(IconButton)

type ColorProps = {
    colorState: ColorsSettings
    dispatch: React.Dispatch<CanvasStateAction>
}

const ColorBlock = ({ dispatch, colorState }: ColorProps) => {
    const [border, setBorder] = useState<HSLColor>(colorState.hexBorder)
    const [bordAnchorEl, setBordAnchorEl] = React.useState<HTMLButtonElement | null>(null)

    const [bgColor, setBgColor] = useState<HSLColor | null>(colorState.background)
    const [bgAnchorEl, setBgAnchorEl] = React.useState<HTMLButtonElement | null>(null)

    return (
        <>
            <Box component="form" m={2}>
                <Typography component="div" gutterBottom>
                    <Box fontWeight="fontWeightBold">Colors</Box>
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={9}>
                        <Typography>Hex border</Typography>
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
                    <ChromePicker
                        color={border}
                        onChange={(color) => setBorder(color.hsl)}
                        onChangeComplete={(color: ColorResult) =>
                            dispatch({
                                type: ActionTypes.SET_COLOR_OPTIONS,
                                payload: { hexBorder: color.hsl },
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
                                background: bgColor ? toHslaStr(bgColor) : checkered,
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
                    <ChromePicker
                        color={bgColor || { h: 0, s: 0, l: 1, a: 0 }}
                        onChange={(color) => setBgColor(color.hsl)}
                        onChangeComplete={(color: ColorResult) =>
                            dispatch({
                                type: ActionTypes.SET_COLOR_OPTIONS,
                                payload: { background: color.hsl },
                            })
                        }
                    />
                </Popover>
            </Box>
            <Box component="form" m={2}>
                <Typography component="div" gutterBottom>
                    <Box fontWeight="fontWeightBold">Palettes</Box>
                </Typography>
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
                                        colors: p.colors,
                                    },
                                    ...(p.setBackground && { background: p.setBackground }),
                                },
                            })
                            if (p.setBackground) setBgColor(p.setBackground)
                        }}
                        style={{
                            background: `linear-gradient(to right, ${p.gradient}), ${checkered}`,
                        }}
                    >
                        {colorState.palette.id === p.id ? <CheckTwoTone color="secondary" /> : null}
                    </PaletteButton>
                ))}
            </Box>
        </>
    )
}

export default ColorBlock
