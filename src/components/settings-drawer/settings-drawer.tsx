import { ChevronRight, ColorLens, GraphicEq, Settings } from '@mui/icons-material'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import { Box, Button, Divider, Drawer, IconButton, Tab, Tabs, Toolbar } from '@mui/material'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import React from 'react'

import { DRAWER_WIDTH, TOOLBAR_HEIGHT } from '#/configs'
import { ActionTypes, CanvasState, CanvasStateAction } from '#/state/canvas-state-types'
import CanvasSizeBlock from './canvas-size-block'
import CellSettingsBlock from './cells-block'
import ColorBlock from './color-block'
import GridBlock from './grid-block'
import NoiseSettingsBlock from './noise-block'

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        drawerPaper: {
            width: DRAWER_WIDTH,
            maxWidth: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
        },
        drawerHeader: {
            display: 'flex',
            padding: theme.spacing(0, 1),
            justifyContent: 'flex-start',
        },
        tab: {
            minWidth: 80,
        },
    })
})

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

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    isOpen,
    handleToggle,
    isBigScreen,
    state,
    dispatch,
}) => {
    const classes = useStyles()
    const [tabIdx, setTabIdx] = React.useState(0)

    const handleChange = (event: React.ChangeEvent<unknown>, newIdx: number) => {
        setTabIdx(newIdx)
    }

    return (
        <>
            <Drawer
                variant="persistent"
                anchor="right"
                open={isOpen}
                classes={{ paper: classes.drawerPaper }}
            >
                <Toolbar
                    className={classes.drawerHeader}
                    variant="dense"
                    style={{ height: TOOLBAR_HEIGHT }}
                >
                    <IconButton onClick={handleToggle} size="large">
                        <ChevronRight />
                    </IconButton>
                    <Tabs value={tabIdx} onChange={handleChange} aria-label="settings-tabs">
                        <Tab className={classes.tab} icon={<Settings />} aria-label="Settings" />
                        <Tab
                            className={classes.tab}
                            icon={<GraphicEq />}
                            aria-label="Noise Settings"
                        />
                        <Tab className={classes.tab} icon={<ColorLens />} aria-label="Colors" />
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
            </Drawer>
        </>
    )
}

export default SettingsPanel
