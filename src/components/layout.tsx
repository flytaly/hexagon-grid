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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                }}
            >
                {children}
                <div style={{ flexGrow: 1 }} />
                <Footer />
            </div>
        </>
    )
}

export default PageLayout
