import React, { useState } from 'react'
import { Grid, Button, IconButton, Popover } from '@material-ui/core'
import { Add, Remove } from '@material-ui/icons'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { SketchPicker, ColorResult, HSLColor } from 'react-color'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import {
    ColorsSettings,
    CanvasStateAction,
    ActionTypes,
    paletteColorsArray,
} from '../../canvas-state'
import { toHslaStr, toHslaObj } from '../../helpers'

type ColorModalProps = {
    isOpen: boolean
    handleClose: () => void
    colorState: ColorsSettings
    dispatch: React.Dispatch<CanvasStateAction>
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modalContent: {
            width: '100%',
            border: '1px solid #555555',
            boxShadow: theme.shadows[10],
            padding: theme.spacing(1),
        },
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
        ul: {
            listStyle: 'none',
            margin: theme.spacing(0, 0, 1, 0),
            padding: 0,
            display: 'flex',
            flexWrap: 'wrap',
        },
    }),
)

type ChangeColorAction = (id: number | string, newColor: HSLColor) => void

type SortableItemProps = {
    value: string
    id: string | number
    changeColorHandler: ChangeColorAction
}

const SortableItem = SortableElement(({ value, id, changeColorHandler }: SortableItemProps) => {
    const [anchorElem, setAnchorElem] = React.useState<HTMLLIElement | null>(null)
    const classes = useStyles()
    const [color, setColor] = useState<string>(value)
    return (
        <>
            <li
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
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
                    onChange={(col) => setColor(toHslaStr(col.hsl))}
                    presetColors={[]}
                    onChangeComplete={(colorRes: ColorResult) =>
                        changeColorHandler(id, colorRes.hsl)
                    }
                />
            </Popover>
        </>
    )
})

type SortableListProps = {
    items: paletteColorsArray
    removeHandler: () => void
    addColorHandler: () => void
    changeColorHandler: ChangeColorAction
}

const SortableList = SortableContainer(
    ({ items, removeHandler, addColorHandler, changeColorHandler }: SortableListProps) => {
        const classes = useStyles()
        return (
            <ul className={classes.ul}>
                {items.map((value, index) => (
                    <SortableItem
                        key={value.id}
                        index={index}
                        id={value.id}
                        changeColorHandler={changeColorHandler}
                        value={toHslaStr(value.hsl)}
                    />
                ))}
                <IconButton
                    className={classes.button}
                    disableRipple
                    onClick={removeHandler}
                    aria-label="Remove color"
                >
                    <Remove />
                </IconButton>
                <IconButton
                    className={classes.button}
                    disableRipple
                    onClick={addColorHandler}
                    aria-label="Add color"
                >
                    <Add />
                </IconButton>
            </ul>
        )
    },
)

const CustomPaletteMaker = ({ handleClose, dispatch, colorState }: ColorModalProps) => {
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
                    hsl: toHslaObj('hsl(0, 0%, 80%)', 1),
                },
            ],
        })
    }

    const changeColorHandler: ChangeColorAction = (id, newColor) => {
        dispatch({
            type: ActionTypes.MODIFY_PALETTE,
            payload: colors.map((col) => ({
                id: col.id,
                hsl: col.id === id ? newColor : col.hsl,
            })),
        })
    }

    return (
        <div className={classes.modalContent}>
            <SortableList
                addColorHandler={addColorHandler}
                removeHandler={removeColorHandler}
                changeColorHandler={changeColorHandler}
                items={colors}
                axis="xy"
                onSortEnd={sortEndHandle}
                distance={1}
            />
            <Grid container justify="flex-end" alignItems="center" spacing={2}>
                <Grid item>
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
                            handleClose()
                        }}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default CustomPaletteMaker