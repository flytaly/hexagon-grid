import React from 'react'
import { NextPage } from 'next'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import RouterAppbar from '../components/router-appbar'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        pageWrapper: {
            height: '100%',
            padding: theme.spacing(2, 2),
        },
    }),
)

const GalleryPage: NextPage = () => {
    const classes = useStyles()
    return (
        <>
            <RouterAppbar />
            <div className={classes.pageWrapper}>
                <h1>Gallery</h1>
            </div>
        </>
    )
}

export default GalleryPage
