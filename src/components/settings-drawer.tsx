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
    FormLabel,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@material-ui/core'
import { ChevronRight, Rotate90DegreesCcw } from '@material-ui/icons'
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
            margin: theme.spacing(2),
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
    isBigScreen: boolean
    handleToggle: () => void
    state: CanvasState
    dispatch: React.Dispatch<CanvasStateAction>
}

type ErrorMessages = {
    width?: 'string'
    height?: 'string'
}

const SettingsPanel = ({
    isOpen,
    handleToggle,
    isBigScreen,
    state,
    dispatch,
}: SettingsPanelProps) => {
    const classes = useStyles()

    const [width, setWidth] = useState(state.canvasSize.width)
    const [height, setHeight] = useState(state.canvasSize.height)
    const [hexSize, setHexSize] = useState(state.hex.size)
    const [errors, setErrors] = useState<ErrorMessages>({})

    const setHexOptsThrottled = useCallback(
        throttle((payload: Partial<HexSettings>) => {
            dispatch({ type: ActionTypes.SET_HEX_OPTIONS, payload })
        }, 100),
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

    const setCanvasSize = (w: number, h: number) => {
        if (errors.width || errors.height) return
        if (state.canvasSize.width !== w || state.canvasSize.height !== h)
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
                        setCanvasSize(width, height)
                    }}
                    onBlur={() => setCanvasSize(width, height)}
                >
                    <div className={classes.inputRow}>
                        <TextField
                            onChange={handleCanvasSizeChange}
                            style={{ width: '30%' }}
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
                            style={{ width: '30%' }}
                            id="height"
                            label="Height"
                            type="number"
                            size="small"
                            value={height || ''}
                            error={!!errors.height}
                            helperText={errors.height}
                            required
                        />
                        <IconButton
                            title="Swap width and height"
                            onClick={() => {
                                setCanvasSize(height, width)
                                setWidth(height)
                                setHeight(width)
                            }}
                        >
                            <Rotate90DegreesCcw />
                        </IconButton>
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
                            if (isBigScreen) setHexOptsThrottled({ size })
                        }}
                        onChangeCommitted={(e, size) => {
                            if (!isBigScreen && !Array.isArray(size))
                                setHexOptsThrottled({
                                    size,
                                })
                        }}
                    />
                </form>
                <Divider />
                <FormControl component="fieldset" className={classes.form}>
                    <FormLabel component="legend">Hexagons orientation</FormLabel>
                    <RadioGroup
                        aria-label="orientation"
                        name="orientation"
                        value={state.hex.orientation}
                        onChange={(e, value) => {
                            const orientation = value === 'flat' ? 'flat' : 'pointy'
                            dispatch({
                                type: ActionTypes.SET_HEX_OPTIONS,
                                payload: { orientation },
                            })
                        }}
                    >
                        <span>
                            <FormControlLabel value="pointy" control={<Radio />} label="pointy" />
                            <FormControlLabel value="flat" control={<Radio />} label="flat" />
                        </span>
                    </RadioGroup>
                </FormControl>
            </Drawer>
        </>
    )
}

export default SettingsPanel
