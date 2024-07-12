import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'

import HeaderLogo from '#/assets/logo.svg?react'
import HelpModal from '#/components/help/help-modal'
import { TOOLBAR_HEIGHT } from '#/configs'
import theme from '#/theme'

type RouterAppBarProps = {
    paddingRight?: number
    isModalOpened?: boolean
    /** if toggleModalHandler callback is passed open help page as modal */
    toggleModalHandler?: () => void
}

function RouterAppBar({
    paddingRight = 0,
    isModalOpened = false,
    toggleModalHandler,
}: RouterAppBarProps) {
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
                    disableGutters
                    sx={{
                        height: TOOLBAR_HEIGHT,
                        paddingLeft: theme.spacing(1.5),
                        paddingRight: `${paddingRight + 16}px`,
                    }}
                >
                    <HeaderLogo height={TOOLBAR_HEIGHT} fill={theme.palette.secondary.main} />
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
