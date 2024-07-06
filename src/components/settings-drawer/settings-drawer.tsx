import { ChevronRight, ColorLens, GraphicEq, Settings } from '@mui/icons-material'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import { Box, Button, Divider, Drawer, IconButton, Tab, Tabs, Toolbar } from '@mui/material'
import React from 'react'

import { DRAWER_WIDTH, TOOLBAR_HEIGHT } from '#/configs'
import { ActionTypes, CanvasState, CanvasStateAction } from '#/state/canvas-state-types'
import CanvasSizeBlock from './canvas-size-block'
import CellSettingsBlock from './cells-block'
import ColorBlock from './color-block'
import GridBlock from './grid-block'
import NoiseSettingsBlock from './noise-block'

interface TabPanelProps {
    children: React.ReactNode
    index: number
    value: number
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props

    return (
        <Box component="div" role="tabpanel" hidden={value !== index}>
            {value === index && children}
        </Box>
    )
}

type SettingsPanelProps = {
    isOpen: boolean
    isBigScreen: boolean
    handleToggle: () => void
    state: CanvasState
    dispatch: React.Dispatch<CanvasStateAction>
}

function SettingsPanel({ isOpen, handleToggle, isBigScreen, state, dispatch }: SettingsPanelProps) {
    const [tabIdx, setTabIdx] = React.useState(0)

    const handleChange = (_event: React.ChangeEvent<unknown>, newIdx: number) => {
        setTabIdx(newIdx)
    }

    return (
        <>
            <Drawer variant="persistent" anchor="right" open={isOpen}>
                <Box
                    sx={{
                        width: DRAWER_WIDTH,
                        maxWidth: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.28)',
                        height: '100%',
                    }}
                >
                    <Toolbar
                        variant="dense"
                        disableGutters
                        sx={{
                            height: TOOLBAR_HEIGHT,
                            display: 'flex',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <IconButton onClick={handleToggle} size="large" aria-label="close settings">
                            <ChevronRight />
                        </IconButton>
                        <Tabs value={tabIdx} onChange={handleChange} aria-label="settings-tabs">
                            <Tab
                                icon={<Settings />}
                                aria-label="General settings"
                                title="General settings"
                            />
                            <Tab
                                icon={<GraphicEq />}
                                aria-label="Noise & Patterns"
                                title="Noise & Patterns"
                            />
                            <Tab icon={<ColorLens />} aria-label="Colors" title="Colors" />
                        </Tabs>
                    </Toolbar>
                    <Divider />
                    <TabPanel value={tabIdx} index={0}>
                        {state.canvasSize.wasMeasured && (
                            <CanvasSizeBlock canvasSize={state.canvasSize} dispatch={dispatch} />
                        )}
                        <Divider />
                        <GridBlock dispatch={dispatch} gridState={state.grid} />
                        <Divider />
                        <CellSettingsBlock
                            dispatch={dispatch}
                            cellState={state.cell}
                            isBigScreen={isBigScreen}
                            type={state.grid.type}
                        />
                    </TabPanel>
                    <TabPanel value={tabIdx} index={1}>
                        <NoiseSettingsBlock dispatch={dispatch} noiseState={state.noise} />
                        <Divider />
                    </TabPanel>
                    <TabPanel value={tabIdx} index={2}>
                        <ColorBlock dispatch={dispatch} colorState={state.colors} />
                        <Divider />
                    </TabPanel>
                    <Box style={{ width: '100%', textAlign: 'end' }}>
                        <Button
                            onClick={() => {
                                dispatch({
                                    type: ActionTypes.RESET_SETTINGS,
                                })
                            }}
                            endIcon={<ClearAllIcon />}
                        >
                            Reset settings
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </>
    )
}

export default SettingsPanel
