import React, { useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Fab } from '@material-ui/core'
import { Settings } from '@material-ui/icons'
import { NextPage } from 'next'
import SettingsPanel from '../components/settings-drawer'
import IndexContent from '../components/index-content'

const useStyles = makeStyles(() =>
    createStyles({
        settingsBtn: {
            position: 'fixed',
            top: '10%',
            right: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
    }),
)

type Props = {
    children: React.ReactNode
}

const Home: NextPage = () => {
    const classes = useStyles()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const handleDrawerToggle = () => setIsDrawerOpen((state) => !state)

    return (
        <>
            <Fab
                className={classes.settingsBtn}
                variant="round"
                color="primary"
                aria-label="Settings"
                onClick={handleDrawerToggle}
            >
                <Settings />
            </Fab>
            <SettingsPanel isOpen={isDrawerOpen} handleToggle={handleDrawerToggle} />
            <IndexContent />
        </>
    )
}

export default Home
