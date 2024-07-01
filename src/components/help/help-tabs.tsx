import { AppBar, Box, Tab, Tabs, Typography } from '@mui/material'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Contacts from './contacts'
import HelpPageContent from './help-content'
import ShortcutsContent from './shortcuts-content'

type StyleProps = {
    withBackground?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            backgroundColor: theme.palette.background.paper,
            background: (props: StyleProps) =>
                props.withBackground ? 'no-repeat url(/hex_bg.png) left bottom' : '',
        },
    }),
)

type TabPanelProps = {
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
    isModal?: boolean
}

const tabData = [
    {
        label: 'Help',
        route: '/help',
    },
    {
        label: 'Shortcuts',
        route: '/shortcuts',
    },
    {
        label: 'Contacts',
        route: '/contacts',
    },
]

const HelpTabs: React.FC<HelpTabsProps> = ({ initTab = 0, isModal = false }) => {
    const [value, setValue] = React.useState(initTab)
    const classes = useStyles({
        withBackground: value === 2,
    })

    const navigate = useNavigate()

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
        if (!isModal) navigate(tabData[newValue].route)
    }

    return (
        <div className={classes.root}>
            <AppBar position="static" color="transparent">
                <Tabs
                    variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                    aria-label="Help tabs"
                >
                    {tabData.map(({ label, route }, idx) => (
                        <LinkTab key={label} label={label} href={route} {...a11yProps(idx)} />
                    ))}
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <HelpPageContent />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ShortcutsContent />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Contacts />
            </TabPanel>
        </div>
    )
}

export default HelpTabs
