import React from 'react'
import { NextPage } from 'next'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Paper, Box } from '@material-ui/core'
import RouterAppbar from '../components/router-appbar'
import HelpTabs from '../components/help/help-tabs'

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

const HelpPage: NextPage = () => {
    const classes = useStyles()
    return (
        <>
            <RouterAppbar />
            <Box className={classes.pageWrapper}>
                <Paper className={classes.paper}>
                    <HelpTabs initTab={0} />
                </Paper>
            </Box>
        </>
    )
}

export default HelpPage
