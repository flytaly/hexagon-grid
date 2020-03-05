import React, { useState, useEffect } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IconButton, Drawer, Toolbar, Divider, TextField } from '@material-ui/core'
import { ChevronRight } from '@material-ui/icons'
import { CanvasState, CanvasStateAction, ActionTypes } from '../canvas-state'

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
            padding: theme.spacing(1),
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

    const [width, setWidth] = useState(state.size.width)
    const [height, setHeight] = useState(state.size.height)
    const [errors, setErrors] = useState<ErrorMessages>({})

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
    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                            onChange={handleSizeChange}
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
                            onChange={handleSizeChange}
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
            </Drawer>
        </>
    )
}

export default SettingsPanel
