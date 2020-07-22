import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Paper, Box } from '@material-ui/core'
import RouterAppbar from '../router-appbar'
import HelpTabs from './help-tabs'

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

type ContainerProps = {
    initTab?: 0 | 1 | 2
}

const HelpPageContainer: React.FC<ContainerProps> = ({ initTab = 0 }) => {
    const classes = useStyles()
    return (
        <>
            <RouterAppbar />
            <Box className={classes.pageWrapper}>
                <Paper className={classes.paper}>
                    <HelpTabs initTab={initTab} />
                </Paper>
            </Box>
        </>
    )
}

export default HelpPageContainer
