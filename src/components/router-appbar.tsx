import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core'
import { useRouter } from 'next/router'
import { toolbarHeight } from '../configs'
import HeaderLogo from '../../public/logo.svg'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            height: toolbarHeight,
            paddingLeft: 0,
        },
        logo: {
            fill: theme.palette.background.default,
            height: toolbarHeight,
        },
    }),
)

const Page: React.FC = () => {
    const router = useRouter()
    const classes = useStyles()
    const clickHandler = (href: RootPage) => (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
        e.preventDefault()
        router.push(href)
    }
    return (
        <AppBar position="static">
            <Toolbar variant="dense" className={classes.toolbar}>
                <HeaderLogo className={classes.logo} />
                <Button color="inherit" onClick={clickHandler('/')} href="/">
                    <Typography>Editor</Typography>
                </Button>
                <Button color="inherit" href="/gallery" onClick={clickHandler('/gallery')}>
                    <Typography>Gallery</Typography>
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default Page
