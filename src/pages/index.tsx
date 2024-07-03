import { Settings } from '@mui/icons-material'
import { Box, Fab, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { useEffect, useReducer, useState } from 'react'

import CanvasPage from '#/components/canvas-page'
import Layout from '#/components/layout'
import RouterAppbar from '#/components/router-appbar'
import SettingsPanel from '#/components/settings-drawer/settings-drawer'
import { DRAWER_WIDTH, TOOLBAR_HEIGHT } from '#/configs'
import galleryList from '#/gallery-data-hash.json'
import useKeyControls from '#/hooks/use-key-controls'
import { initialState } from '#/state/canvas-state'
import { ActionTypes, CanvasStateAction } from '#/state/canvas-state-types'
import { reducer } from '#/state/reducer'

type Dispatch = React.Dispatch<CanvasStateAction>

function useSetInitialState(dispatch: Dispatch) {
    const [imageIndex] = useState(() => Math.floor(Math.random() * galleryList.length))

    useEffect(() => {
        const size = {
            width: Math.ceil(window.screen.width * window.devicePixelRatio),
            height: Math.ceil(window.screen.height * window.devicePixelRatio),
            pixelRatio: window.devicePixelRatio,
        }
        dispatch({ type: ActionTypes.SET_SIZE, payload: size })

        if (window.location.hash.length) {
            mergeFromHash(dispatch)
        } else {
            const { hash } = galleryList[imageIndex]
            dispatch({
                type: ActionTypes.MERGE_STATE_FROM_QUERY,
                payload: { hash, skipCanvasSize: true },
            })
        }
    }, [dispatch, imageIndex])
}

function mergeFromHash(dispatch: Dispatch) {
    const { hash } = window.location
    if (!hash.length) return
    dispatch({
        type: ActionTypes.MERGE_STATE_FROM_QUERY,
        payload: { hash },
    })
}

function Home() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [helpModal, setHelpModal] = useState(false)
    const [isInitValue, setIsInitValue] = useState(true)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const handleDrawerToggle = () => setIsDrawerOpen((_state) => !_state)

    const isBigScreen = useMediaQuery((_theme: Theme) => _theme.breakpoints.up('sm'))

    const drawerWidth = isBigScreen && isDrawerOpen ? DRAWER_WIDTH : 0

    if (isInitValue && isBigScreen) {
        // open settings panel on big screen but only once
        setIsInitValue(false)
        setIsDrawerOpen(true)
    }

    const toggleHelpModal = () => setHelpModal((s) => !s)

    useKeyControls(dispatch, toggleHelpModal)

    useSetInitialState(dispatch)

    useEffect(() => {
        const onHashChange = () => mergeFromHash(dispatch)
        window.addEventListener('hashchange', onHashChange)
        return () => window.removeEventListener('hashchange', onHashChange)
    }, [dispatch])

    return (
        <Layout>
            <RouterAppbar
                paddingRight={drawerWidth}
                isModalOpened={helpModal}
                toggleModalHandler={toggleHelpModal}
            />
            <Box
                sx={{
                    height: '100%',
                    maxHeight: `calc(100% - ${TOOLBAR_HEIGHT}px - 2rem)`,
                    marginRight: `${drawerWidth}px`,
                }}
            >
                <CanvasPage dispatch={dispatch} state={state} />
            </Box>
            <Fab
                variant="circular"
                color="primary"
                aria-label="Settings"
                onClick={handleDrawerToggle}
                sx={{
                    top: TOOLBAR_HEIGHT + 16,
                    right: 0,
                    position: 'fixed',
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                }}
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
        </Layout>
    )
}

export default Home
