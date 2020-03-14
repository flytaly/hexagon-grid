import React, { useState, useReducer, useEffect } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Fab, useMediaQuery } from '@material-ui/core'
import { Settings } from '@material-ui/icons'
import { NextPage } from 'next'
import SettingsPanel from '../components/settings-drawer/settings-drawer'
import CanvasPage from '../components/canvas-page'
import { reducer, initialState, ActionTypes } from '../canvas-state'
import useKeyControls from '../hooks/use-key-controls'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        settingsBtn: {
            position: 'fixed',
            top: '10%',
            right: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
        pageWrapper: {
            height: '100%',
            marginRight: (props: { pageMarginR: number }) => props.pageMarginR,
            paddingTop: theme.spacing(3),
        },
    }),
)

const Home: NextPage = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [isInitValue, setIsInitValue] = useState(true)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const handleDrawerToggle = () => setIsDrawerOpen((_state) => !_state)

    const isBigScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

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

    useKeyControls(dispatch)

    return (
        <>
            <div className={classes.pageWrapper}>
                <CanvasPage state={state} />
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
