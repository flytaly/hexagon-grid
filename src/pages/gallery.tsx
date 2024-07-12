import { Box, Paper, Typography } from '@mui/material'

import Gallery from '#/components/image-gallery'
import Layout from '#/components/layout'
import RouterAppbar from '#/components/router-appbar'

const GalleryPage = () => {
    return (
        <Layout>
            <RouterAppbar />
            <Box padding={2}>
                <Paper>
                    <Box padding={2}>
                        <Typography variant="h4" align="center" component="h2">
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
