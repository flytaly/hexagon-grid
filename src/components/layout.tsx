import { Box } from '@mui/material'
import React from 'react'

import useSetTitle from '#/hooks/use-set-title'
import Footer from './footer'

type PageProps = {
    children: React.ReactNode
}

function PageLayout({ children }: PageProps) {
    useSetTitle('/')

    return (
        <>
            <Box
                sx={{
                    height: '100vh',
                    width: '100vw',
                    maxWidth: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: '1fr auto',
                }}
            >
                <Box>{children}</Box>
                <Footer />
            </Box>
        </>
    )
}

export default PageLayout
