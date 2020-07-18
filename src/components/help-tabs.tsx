import React from 'react'
import { Typography, AppBar, Tabs, Tab, Box } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.paper,
        },
    }),
)

interface TabPanelProps {
    children: React.ReactNode
    index: number
    value: number
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
            aria-labelledby={`nav-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    )
}

function a11yProps(index: number | string) {
    return {
        id: `nav-tab-${index}`,
        'aria-controls': `nav-tabpanel-${index}`,
    }
}

interface LinkTabProps {
    label: string
    href: string
}

function LinkTab(props: LinkTabProps) {
    return (
        <Tab
            component="a"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                event.preventDefault()
            }}
            {...props}
        />
    )
}

type HelpTabsProps = {
    initTab?: number
}

const HelpTabs: React.FC<HelpTabsProps> = ({ initTab = 0 }) => {
    const classes = useStyles()
    const [value, setValue] = React.useState(initTab)

    // eslint-disable-next-line @typescript-eslint/ban-types
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
    }

    return (
        <div className={classes.root}>
            <AppBar position="static" color="transparent">
                <Tabs
                    // variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                    aria-label="Help tabs"
                >
                    <LinkTab label="Help" href="/help" {...a11yProps(0)} />
                    <LinkTab label="Shortcuts" href="/shortcuts" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Typography variant="h4">Help</Typography>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Typography variant="h4">Keyboard shortcuts</Typography>
            </TabPanel>
        </div>
    )
}

export default HelpTabs
