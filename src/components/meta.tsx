import Head from 'next/head'
import React from 'react'
import theme from '../theme'

const Meta: React.FC = () => {
    return (
        <Head>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content={theme.palette.primary.main} />
        </Head>
    )
}

export default Meta
