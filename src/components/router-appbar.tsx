import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Button, IconButton } from '@material-ui/core'
import { useRouter } from 'next/router'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import KeyboardIcon from '@material-ui/icons/Keyboard'
import { TOOLBAR_HEIGHT } from '../configs'
import HeaderLogo from '../../public/logo.svg'
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
    const router = useRouter()
    const classes = useStyles()
    const [helpTabIdx, setHelpTabIdx] = useState(0)

    const makeClickHandler = (href: RootPage) => (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
        e.preventDefault()
        router.push(href)
    }

    const onHelpModalClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        const route = e.currentTarget.getAttribute('href') as RootPage
        if (toggleModalHandler) {
            toggleModalHandler()
            setHelpTabIdx(route === '/shortcuts' ? 1 : 0)
        } else {
            router.push(route)
        }
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar
                    variant="dense"
                    className={classes.toolbar}
                    style={{
                        paddingRight: `${paddingRight}px`,
                    }}
                >
                    <HeaderLogo className={classes.logo} />
                    <Button color="inherit" onClick={makeClickHandler('/')} href="/">
                        <Typography>Editor</Typography>
                    </Button>
                    <Button color="inherit" href="/gallery" onClick={makeClickHandler('/gallery')}>
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
