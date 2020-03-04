import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IconButton, Drawer } from '@material-ui/core'
import { ChevronLeft } from '@material-ui/icons'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawerPaper: {
            width: drawerWidth,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
            justifyContent: 'flex-start',
        },
        settingsBtn: {
            position: 'fixed',
            top: '10%',
            right: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
    }),
)

type SettingsPanelProps = {
    isOpen: boolean
    handleToggle: () => void
}

const SettingsPanel = ({ isOpen, handleToggle }: SettingsPanelProps) => {
    const classes = useStyles()

    return (
        <>
            <Drawer
                variant="persistent"
                anchor="right"
                open={isOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleToggle}>
                        <ChevronLeft />
                    </IconButton>
                </div>
            </Drawer>
        </>
    )
}

export default SettingsPanel
