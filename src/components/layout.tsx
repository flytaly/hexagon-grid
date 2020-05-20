import React from 'react'
import Meta from './meta'

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
            </div>
        </>
    )
}

export default PageLayout
