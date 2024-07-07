import { Add, Remove } from '@mui/icons-material'
import { Box, Button, Grid, IconButton, Popover, Typography } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import React, { useState } from 'react'
import { ColorResult, RGBColor, SketchPicker } from 'react-color'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import { toRGBaObj, toRGBAStr } from '#/helpers'
import { PaletteColorsArray } from '#/palettes'
import { ActionTypes, CanvasStateAction, ColorsSettings } from '#/state/canvas-state-types'

type ColorModalProps = {
    isOpen: boolean
    handleClose: () => void
    colorState: ColorsSettings
    dispatch: React.Dispatch<CanvasStateAction>
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            width: '25px',
            height: '25px',
            minWidth: '25px',
            margin: '2px',
            padding: 0,
            borderRadius: '4px',
            border: '1px solid grey',
            '&:focus': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: '1px',
            },
        },
    }),
)

type ChangeColorAction = (id: number | string, newColor: RGBColor) => void

type SortableItemProps = {
    value: string
    id: string | number
    changeColorHandler: ChangeColorAction
}

const SortableItem = SortableElement<SortableItemProps>(
    ({ value, id, changeColorHandler }: SortableItemProps) => {
        const [anchorElem, setAnchorElem] = React.useState<HTMLLIElement | null>(null)
        const classes = useStyles()
        const [color, setColor] = useState<string>(value)
        return (
            <>
                <li
                    role="button"
                    tabIndex={0}
                    aria-label="select color"
                    className={classes.button}
                    style={{ backgroundColor: color }}
                    onClick={(e) => setAnchorElem(e.currentTarget)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            setAnchorElem(e.currentTarget)
                        }
                    }}
                />
                <Popover
                    id="border-color-picker"
                    open={Boolean(anchorElem)}
                    anchorEl={anchorElem}
                    onClose={() => setAnchorElem(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <SketchPicker
                        color={color}
                        onChange={(col) => setColor(toRGBAStr(col.rgb))}
                        presetColors={[]}
                        onChangeComplete={(colorRes: ColorResult) =>
                            changeColorHandler(id, colorRes.rgb)
                        }
                    />
                </Popover>
            </>
        )
    },
)

type SortableListProps = {
    items: PaletteColorsArray
    changeColorHandler: ChangeColorAction
}

const SortableList = SortableContainer<SortableListProps>(
    ({ items, changeColorHandler }: SortableListProps) => {
        return (
            <Box
                component="ul"
                sx={{
                    listStyle: 'none',
                    margin: (theme) => theme.spacing(0, 0, 1, 0),
                    padding: 0,
                    display: 'flex',
                    flexWrap: 'wrap',
                }}
            >
                {items.map((value, index) => (
                    <SortableItem
                        key={value.id}
                        index={index}
                        id={value.id}
                        changeColorHandler={changeColorHandler}
                        value={toRGBAStr(value.rgb)}
                    />
                ))}
            </Box>
        )
    },
)

const CustomPaletteMaker: React.FC<ColorModalProps> = ({ handleClose, dispatch, colorState }) => {
    const classes = useStyles()
    const { colors } = colorState.palette

    const sortEndHandle = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
        if (oldIndex === newIndex) return
        const newColors = [...colors]
        const elem = newColors.splice(oldIndex, 1)[0]
        newColors.splice(newIndex, 0, elem)
        dispatch({
            type: ActionTypes.MODIFY_PALETTE,
            payload: newColors,
        })
    }

    const removeColorHandler = () => {
        dispatch({
            type: ActionTypes.MODIFY_PALETTE,
            payload: colors.slice(0, colors.length - 1),
        })
    }

    const addColorHandler = () => {
        dispatch({
            type: ActionTypes.MODIFY_PALETTE,
            payload: [
                ...colors,
                {
                    id: Date.now(),
                    rgb: colors.length ? colors[colors.length - 1].rgb : toRGBaObj('#d2d2d2', 1),
                },
            ],
        })
    }

    const changeColorHandler: ChangeColorAction = (id, newColor) => {
        dispatch({
            type: ActionTypes.MODIFY_PALETTE,
            payload: colors.map((col) => ({
                id: col.id,
                rgb: col.id === id ? newColor : col.rgb,
            })),
        })
    }

    return (
        <Box
            sx={{
                width: '100%',
                border: '1px solid #555555',
                boxShadow: (theme) => theme.shadows[10],
                padding: (theme) => theme.spacing(1),
            }}
        >
            <Typography variant="subtitle1" gutterBottom>
                Click to change color, drag to sort:
            </Typography>
            <SortableList
                changeColorHandler={changeColorHandler}
                items={colors}
                axis="xy"
                onSortEnd={sortEndHandle}
                distance={1}
            />
            <Grid container alignItems="center" spacing={2}>
                <Grid item>
                    <IconButton
                        className={classes.button}
                        disableRipple
                        onClick={removeColorHandler}
                        aria-label="Remove color"
                        size="large"
                    >
                        <Remove />
                    </IconButton>
                    <IconButton
                        className={classes.button}
                        disableRipple
                        onClick={addColorHandler}
                        aria-label="Add color"
                        size="large"
                    >
                        <Add />
                    </IconButton>
                </Grid>
                <Grid item style={{ marginLeft: 'auto' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            handleClose()
                        }}
                    >
                        Cancel
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => {
                            dispatch({
                                type: ActionTypes.SAVE_NEW_PALETTE,
                            })
                            handleClose()
                        }}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}

export default CustomPaletteMaker
