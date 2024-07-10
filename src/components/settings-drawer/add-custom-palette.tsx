import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Add, Remove } from '@mui/icons-material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Box, Button, Grid, Popover, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    useDndMonitor,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core'

import ColorPicker, { ColorButton } from '#/components/color-picker'
import { toRGBaObj, toRGBAStr } from '#/helpers'
import { PaletteColorsArray } from '#/palettes'
import { ActionTypes, CanvasStateAction, ColorsSettings } from '#/state/canvas-state-types'

type ColorModalProps = {
    isOpen: boolean
    handleClose: () => void
    colorState: ColorsSettings
    dispatch: React.Dispatch<CanvasStateAction>
}

type ChangeColorAction = (id: number | string, newColor: RGBColor) => void

type SortableItemProps = {
    value: string
    id: string | number
    changeColorHandler: ChangeColorAction
}

const SortableItem = ({ value, id, changeColorHandler }: SortableItemProps) => {
    const [anchorElem, setAnchorElem] = React.useState<HTMLElement | null>(null)

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id,
        data: { type: 'color' },
    })

    return (
        <>
            <ColorButton
                component="li"
                disableRipple
                sx={{
                    width: '1.5rem',
                    height: '1.5rem',
                    transform: CSS.Transform.toString(transform),
                    transition,
                    ':focus': { outline: '2px solid #1976d2' },
                }}
                bgcolor={value}
                onClick={(e) => setAnchorElem(e.currentTarget)}
                ref={setNodeRef}
                {...attributes}
                {...listeners}
            />
            <Popover
                id="border-color-picker"
                open={Boolean(anchorElem)}
                anchorEl={anchorElem}
                onClose={() => setAnchorElem(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <ColorPicker
                    color={value}
                    onChange={(col) => {
                        changeColorHandler(id, col)
                    }}
                    presetColors={[]}
                />
            </Popover>
        </>
    )
}

type SortableListProps = {
    items: PaletteColorsArray
    changeColorHandler: ChangeColorAction
    onSortEnd: (event: DragEndEvent) => void
}

function Trash() {
    const { setNodeRef, isOver } = useDroppable({
        id: 'trash',
        data: {
            type: 'trash',
            accept: 'color',
        },
    })

    const [isDragging, setIsDragging] = useState(false)

    useDndMonitor({
        onDragStart: () => setIsDragging(true),
        onDragEnd: () => setIsDragging(false),
    })

    return (
        <Box
            ref={setNodeRef}
            sx={{
                width: '1.5rem',
                height: '1.5rem',
                opacity: isDragging ? 1 : 0,
            }}
        >
            <DeleteOutlineIcon color={isOver ? 'warning' : 'action'} />
        </Box>
    )
}

const SortableList = ({ items, changeColorHandler, onSortEnd }: SortableListProps) => {
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }))

    return (
        <DndContext
            onDragStart={() => {}}
            onDragEnd={onSortEnd}
            collisionDetection={closestCenter}
            sensors={sensors}
        >
            <SortableContext items={items}>
                <Box
                    component="ul"
                    sx={{
                        listStyle: 'none',
                        margin: (theme) => theme.spacing(0, 0, 1, 0),
                        padding: 0,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.25rem',
                        width: '100%',
                    }}
                >
                    {items.map((value) => (
                        <SortableItem
                            key={value.id}
                            id={value.id}
                            changeColorHandler={changeColorHandler}
                            value={toRGBAStr(value.rgb)}
                        />
                    ))}
                    <Box sx={{ marginLeft: 'auto' }}>
                        <Trash />
                    </Box>
                </Box>
            </SortableContext>
        </DndContext>
    )
}

function CustomPaletteMaker({ handleClose, dispatch, colorState }: ColorModalProps) {
    const { colors } = colorState.palette

    const sortEndHandle = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        if (over.id === 'trash') {
            dispatch({
                type: ActionTypes.MODIFY_PALETTE,
                payload: colors.filter((c) => c.id !== active.id),
            })
            return
        }

        const oldIndex = colors.findIndex((i) => i.id === active.id)
        const newIndex = colors.findIndex((i) => i.id === over.id)
        dispatch({
            type: ActionTypes.MODIFY_PALETTE,
            payload: arrayMove(colors, oldIndex, newIndex),
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
                onSortEnd={sortEndHandle}
            />
            <Grid container alignItems="center" spacing={2}>
                <Grid item>
                    <Stack direction="row" gap="0.25rem">
                        <ColorButton
                            disableRipple
                            onClick={removeColorHandler}
                            aria-label="Remove color"
                            sx={{ width: '1.5rem', height: '1.5rem' }}
                        >
                            <Remove />
                        </ColorButton>
                        <ColorButton
                            disableRipple
                            onClick={addColorHandler}
                            aria-label="Add color"
                            sx={{ width: '1.5rem', height: '1.5rem' }}
                        >
                            <Add />
                        </ColorButton>
                    </Stack>
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
