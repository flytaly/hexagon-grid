import { Rotate90DegreesCcw } from '@mui/icons-material'
import { Box, Grid, IconButton, TextField } from '@mui/material'
import React, { useState } from 'react'

import { ActionTypes, CanvasSize, CanvasStateAction } from '#/state/canvas-state-types'

type CanvasProps = {
    canvasSize: CanvasSize
    dispatch: React.Dispatch<CanvasStateAction>
}

type ErrorMessages = {
    width?: 'string'
    height?: 'string'
}

function CanvasSizeBlock({ canvasSize, dispatch }: CanvasProps) {
    const [width, setWidth] = useState(canvasSize.width)
    const [height, setHeight] = useState(canvasSize.height)
    const [errors, setErrors] = useState<ErrorMessages>({})

    const setCanvasSize = (w: number, h: number) => {
        if (errors.width || errors.height) return
        if (canvasSize.width !== w || canvasSize.height !== h)
            dispatch({ type: ActionTypes.SET_SIZE, payload: { width: w, height: h } })
    }
    const handleCanvasSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id } = e.target
        const value = +e.target.value
        if (id === 'width') setWidth(value)
        if (id === 'height') setHeight(value)
        if (value < 100) {
            return setErrors((er) => ({ ...er, [id]: 'Too small (<100)' }))
        }
        if (value > 7680) {
            return setErrors((er) => ({ ...er, [id]: 'Too big (>7680)' }))
        }
        return setErrors((er) => ({ ...er, [id]: '' }))
    }

    return (
        <Box
            component="form"
            m={2}
            onSubmit={(e) => {
                e.preventDefault()
                setCanvasSize(width, height)
            }}
            onBlur={() => setCanvasSize(width, height)}
        >
            <Grid container spacing={2}>
                <Grid item xs>
                    <TextField
                        onChange={handleCanvasSizeChange}
                        id="width"
                        label="Width"
                        type="number"
                        size="small"
                        value={width || ''}
                        error={!!errors.width}
                        helperText={errors.width}
                        required
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        onChange={handleCanvasSizeChange}
                        id="height"
                        label="Height"
                        type="number"
                        size="small"
                        value={height || ''}
                        error={!!errors.height}
                        helperText={errors.height}
                        required
                    />
                </Grid>
                <Grid item xs>
                    <IconButton
                        title="Swap width and height"
                        onClick={() => {
                            setCanvasSize(height, width)
                            setWidth(height)
                            setHeight(width)
                        }}
                        size="large"
                    >
                        <Rotate90DegreesCcw />
                    </IconButton>
                </Grid>
            </Grid>
            <input type="submit" style={{ display: 'none' }} />
        </Box>
    )
}

export default CanvasSizeBlock
