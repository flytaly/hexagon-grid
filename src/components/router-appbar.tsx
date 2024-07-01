import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import React, { useState } from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import HeaderLogo from '../assets/logo.svg?react'
import { TOOLBAR_HEIGHT } from '../configs'
import HelpModal from './help/help-modal'

type RouterAppBarProps = {
    paddingRight?: number
    isModalOpened?: boolean
    /** if toggleModalHandler callback is passed open help page as modal */
    toggleModalHandler?: () => void
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            height: TOOLBAR_HEIGHT,
            paddingLeft: 0,
            '& svg': {
                height: TOOLBAR_HEIGHT,
            },
            '& a:last-child': {
                marginRight: theme.spacing(1),
            },
        },
        logo: {
            fill: theme.palette.secondary.main,
            height: TOOLBAR_HEIGHT,
        },
    }),
)

const RouterAppBar: React.FC<RouterAppBarProps> = ({
    paddingRight = 0,
    isModalOpened = false,
    toggleModalHandler,
}) => {
    const classes = useStyles()
    const [helpTabIdx, setHelpTabIdx] = useState(0)

    const onHelpModalClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!toggleModalHandler) return

        const route = e.currentTarget.getAttribute('href') as RootPage
        toggleModalHandler()
        setHelpTabIdx(route === '/shortcuts' ? 1 : 0)
        e.preventDefault()
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar
                    variant="dense"
                    className={classes.toolbar}
                    style={{ paddingRight: `${paddingRight}px` }}
                >
                    <HeaderLogo className={classes.logo} />
                    <Button color="inherit" href="/">
                        <Typography>Editor</Typography>
                    </Button>
                    <Button color="inherit" href="/gallery">
                        <Typography>Gallery</Typography>
                    </Button>
                    <div style={{ flexGrow: 1 }} />
                    <IconButton
                        color="inherit"
                        aria-label="help page"
                        title="help"
                        size="small"
                        href="/help"
                        onClick={onHelpModalClick}
                    >
                        <HelpOutlineIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="help page"
                        title="help"
                        size="small"
                        href="/shortcuts"
                        onClick={onHelpModalClick}
                    >
                        <KeyboardIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <HelpModal
                isOpen={isModalOpened}
                handleClose={() => toggleModalHandler && toggleModalHandler()}
                initTab={helpTabIdx}
            />
        </>
    )
}

export default RouterAppBar
