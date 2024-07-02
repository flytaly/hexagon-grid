import { Box, Paper, Typography } from '@mui/material'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'

import Gallery from '#/components/image-gallery'
import Layout from '#/components/layout'
import RouterAppbar from '#/components/router-appbar'

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

const GalleryPage = () => {
    const classes = useStyles()
    return (
        <Layout>
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
        </Layout>
    )
}

export default GalleryPage
