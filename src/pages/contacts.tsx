import React from 'react'
import { NextPage } from 'next'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Paper, Box } from '@material-ui/core'
import RouterAppbar from '../components/router-appbar'
import HelpTabs from '../components/help/help-tabs'
import Footer from '../components/footer'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        pageWrapper: {
            width: '100%',
            padding: theme.spacing(2, 3),
        },
        paper: {
            width: '1000px',
            maxWidth: '100%',
            margin: '0 auto',
        },
    }),
)

const HelpShortcutsPage: NextPage = () => {
    const classes = useStyles()
    return (
        <>
            <RouterAppbar />
            <Box className={classes.pageWrapper}>
                <Paper className={classes.paper}>
                    <HelpTabs initTab={2} />
                </Paper>
            </Box>
            <Footer />
        </>
    )
}

export default HelpShortcutsPage
