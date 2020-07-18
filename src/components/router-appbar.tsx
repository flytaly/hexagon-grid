/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Button, IconButton } from '@material-ui/core'
import { useRouter } from 'next/router'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { TOOLBAR_HEIGHT } from '../configs'
import HeaderLogo from '../../public/logo.svg'
import HelpModal from './help-modal'

type RouterAppBarProps = {
    paddingRight?: number
    helpAsModal?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            height: TOOLBAR_HEIGHT,
            paddingLeft: 0,
        },
        logo: {
            fill: theme.palette.background.default,
            height: TOOLBAR_HEIGHT,
        },
        rightButton: {
            marginLeft: 'auto',
            marginRight: theme.spacing(2),
            height: TOOLBAR_HEIGHT,
        },
    }),
)

const RouterAppBar: React.FC<RouterAppBarProps> = ({ paddingRight = 0, helpAsModal = false }) => {
    const router = useRouter()
    const classes = useStyles()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const makeClickHandler = (href: RootPage) => (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
        e.preventDefault()
        router.push(href)
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
                    <IconButton
                        color="inherit"
                        aria-label="help page"
                        title="help"
                        size="small"
                        className={classes.rightButton}
                        href="/help"
                        onClick={(e) => {
                            e.preventDefault()
                            if (helpAsModal) {
                                setIsModalOpen((s) => !s)
                            } else {
                                router.push('/help')
                            }
                        }}
                    >
                        <HelpOutlineIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <HelpModal isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)} />
        </>
    )
}

export default RouterAppBar
