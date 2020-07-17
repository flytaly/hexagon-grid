import React from 'react'
import { NextPage } from 'next'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Paper, Box, Typography } from '@material-ui/core'
import RouterAppbar from '../components/router-appbar'
import Gallery from '../components/image-gallery'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        pageWrapper: {
            // height: '100%',
            padding: theme.spacing(2, 3),
        },
        paper: {
            padding: theme.spacing(1),
        },
    }),
)

const GalleryPage: NextPage = () => {
    const classes = useStyles()
    return (
        <>
            <RouterAppbar />
            <Box className={classes.pageWrapper}>
                <Paper className={classes.paper}>
                    <Box>
                        <Typography variant="h4" align="center">
                            Gallery
                        </Typography>
                        <Gallery />
                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default GalleryPage
