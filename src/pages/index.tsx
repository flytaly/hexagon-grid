import React, { useState, useReducer, useEffect } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Fab, useMediaQuery, AppBar, Toolbar, Typography } from '@material-ui/core'
import { Settings } from '@material-ui/icons'
import { NextPage } from 'next'
import SettingsPanel from '../components/settings-drawer/settings-drawer'
import CanvasPage from '../components/canvas-page'
import { reducer, initialState, ActionTypes } from '../canvas-state'
import { toolbarHeight } from '../configs'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        settingsBtn: {
            position: 'fixed',
            top: `${toolbarHeight + theme.spacing(2)}px`,
            right: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
        pageWrapper: {
            height: '100%',
            maxHeight: `calc(100% - ${toolbarHeight}px)`,
            marginRight: (props: { pageMarginR: number }) => props.pageMarginR,
        },
    }),
)

const Home: NextPage = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [isInitValue, setIsInitValue] = useState(true)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const handleDrawerToggle = () => setIsDrawerOpen((_state) => !_state)

    console.log(JSON.stringify(state))

    const isBigScreen = useMediaQuery((_theme: Theme) => _theme.breakpoints.up('sm'))

    const classes = useStyles({
        pageMarginR: isBigScreen && isDrawerOpen ? 360 : 0,
    })

    if (isInitValue && isBigScreen) {
        // open settings panel on big screen but only once
        setIsInitValue(false)
        setIsDrawerOpen(true)
    }

    useEffect(() => {
        const size = {
            width: Math.ceil(window.screen.width * window.devicePixelRatio),
            height: Math.ceil(window.screen.height * window.devicePixelRatio),
            pixelRatio: window.devicePixelRatio,
        }
        dispatch({ type: ActionTypes.SET_SIZE, payload: size })
    }, [dispatch])

    return (
        <>
            <AppBar position="static">
                <Toolbar variant="dense" style={{ height: toolbarHeight }}>
                    <Typography>Hexagons</Typography>
                </Toolbar>
            </AppBar>
            <div className={classes.pageWrapper}>
                <CanvasPage dispatch={dispatch} state={state} />
            </div>
            <Fab
                className={classes.settingsBtn}
                variant="round"
                color="primary"
                aria-label="Settings"
                onClick={handleDrawerToggle}
            >
                <Settings />
            </Fab>
            <SettingsPanel
                state={state}
                dispatch={dispatch}
                isOpen={isDrawerOpen}
                handleToggle={handleDrawerToggle}
                isBigScreen={isBigScreen}
            />
        </>
    )
}

export default Home
