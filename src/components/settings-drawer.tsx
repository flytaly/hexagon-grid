import React, { useState, useEffect, useCallback } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
    IconButton,
    Drawer,
    Toolbar,
    Divider,
    TextField,
    Typography,
    Slider,
} from '@material-ui/core'
import { ChevronRight } from '@material-ui/icons'
import throttle from 'lodash.throttle'
import { CanvasState, CanvasStateAction, ActionTypes, HexSettings } from '../canvas-state'

const drawerWidth = 360

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        drawerPaper: {
            width: drawerWidth,
            maxWidth: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
        },
        drawerHeader: {
            display: 'flex',
            padding: theme.spacing(0, 1),
            justifyContent: 'flex-start',
        },
        settingsBtn: {
            position: 'fixed',
            top: '100px',
            right: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
        form: {
            padding: theme.spacing(2),
        },
        inputRow: {
            display: 'flex',
            justifyContent: 'space-around',
            margin: theme.spacing(1, 0),
        },
    })
})

type SettingsPanelProps = {
    isOpen: boolean
    handleToggle: () => void
    state: CanvasState
    dispatch: React.Dispatch<CanvasStateAction>
}

type ErrorMessages = {
    width?: 'string'
    height?: 'string'
}

const SettingsPanel = ({ isOpen, handleToggle, state, dispatch }: SettingsPanelProps) => {
    const classes = useStyles()

    const [width, setWidth] = useState(state.canvasSize.width)
    const [height, setHeight] = useState(state.canvasSize.height)
    const [hexSize, setHexSize] = useState(state.hex.size)
    const [errors, setErrors] = useState<ErrorMessages>({})

    const setHexOptsThrottled = useCallback(
        throttle((payload: Partial<HexSettings>) => {
            dispatch({ type: ActionTypes.SET_HEX_OPTIONS, payload })
        }, 33), // 30 fps
        [],
    )

    useEffect(() => {
        const size = {
            width: Math.ceil(window.screen.width * window.devicePixelRatio),
            height: Math.ceil(window.screen.height * window.devicePixelRatio),
            pixelRatio: window.devicePixelRatio,
        }
        setWidth(size.width)
        setHeight(size.height)
        dispatch({ type: ActionTypes.SET_SIZE, payload: size })
    }, [dispatch])

    const setCanvasSize = () => {
        if (errors.width || errors.height) return
        dispatch({ type: ActionTypes.SET_SIZE, payload: { width, height } })
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
        <>
            <Drawer
                variant="persistent"
                anchor="right"
                open={isOpen}
                classes={{ paper: classes.drawerPaper }}
            >
                <Toolbar className={classes.drawerHeader} variant="dense">
                    <IconButton onClick={handleToggle}>
                        <ChevronRight />
                    </IconButton>
                </Toolbar>
                <Divider />
                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        e.preventDefault()
                        setCanvasSize()
                    }}
                    onBlur={() => setCanvasSize()}
                >
                    <div className={classes.inputRow}>
                        <TextField
                            onChange={handleCanvasSizeChange}
                            style={{ width: '40%' }}
                            id="width"
                            label="Width"
                            type="number"
                            size="small"
                            value={width || ''}
                            error={!!errors.width}
                            helperText={errors.width}
                            required
                        />
                        <TextField
                            onChange={handleCanvasSizeChange}
                            style={{ width: '40%' }}
                            id="height"
                            label="Height"
                            type="number"
                            size="small"
                            value={height || ''}
                            error={!!errors.height}
                            helperText={errors.height}
                            required
                        />
                    </div>
                    <input type="submit" style={{ display: 'none' }} />
                </form>
                <Divider />
                <form className={classes.form}>
                    <Typography id="hexagons_size" gutterBottom>
                        Hexagons size
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
                            setHexOptsThrottled({ size })
                        }}
                    />
                </form>
            </Drawer>
        </>
    )
}

export default SettingsPanel
