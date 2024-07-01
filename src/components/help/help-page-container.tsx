import React from 'react'
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Paper, Box } from '@mui/material'
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
