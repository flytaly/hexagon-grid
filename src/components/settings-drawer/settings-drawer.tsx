import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Divider, Drawer, IconButton, Toolbar, Tabs, Tab } from '@material-ui/core'
import { ChevronRight, Settings, GraphicEq, ColorLens } from '@material-ui/icons'
import { CanvasState, CanvasStateAction } from '../../state/canvas-state-types'
import CellSettingsBlock from './cells-block'
import NoiseSettingsBlock from './noise-block'
import CanvasSizeBlock from './canvas-size-block'
import GridBlock from './grid-block'
import ColorBlock from './color-block'
import { TOOLBAR_HEIGHT, DRAWER_WIDTH } from '../../configs'

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
    const [tabIdx, setTabIdx] = React.useState(2)

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
                    <IconButton onClick={handleToggle}>
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
            </Drawer>
        </>
    )
}

export default SettingsPanel
