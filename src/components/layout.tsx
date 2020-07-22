import React from 'react'
import Meta from './meta'
import Footer from './footer'

type PageProps = {
    children: React.ReactNode
}

const PageLayout: React.FC<PageProps> = ({ children }) => {
    return (
        <>
            <Meta />
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
