import Head from 'next/head'
import React from 'react'
import { useRouter } from 'next/router'
import theme from '../theme'

const routeTitles: Record<RootPage, string> = {
    '/': 'editor',
    '/gallery': 'gallery',
    '/help': 'help',
    '/shortcuts': 'shortcuts',
    '/contacts': 'contacts',
}

const Meta: React.FC = () => {
    const router = useRouter()
    const route = router.route as RootPage
    let title = 'Hexagonal grid'
    title += routeTitles[route] ? ` -- ${routeTitles[route]}` : ''

    return (
        <Head>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />

            <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-icon-57x57.png" />
            <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-icon-60x60.png" />
            <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-icon-72x72.png" />
            <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-icon-76x76.png" />
            <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-icon-114x114.png" />
            <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
            <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-icon-144x144.png" />
            <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
            <link
                rel="icon"
                type="image/png"
                sizes="192x192"
                href="/icons/android-icon-192x192.png"
            />
            <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
            <link rel="manifest" href="/icons/manifest.json" />
            <meta name="msapplication-TileColor" content="#ffffff" />
            <meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.png" />
            <meta charSet="utf-8" />
            <title>{title}</title>
            <meta name="description" content="Generate hexagonal, triangular and voronoi grids" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content={theme.palette.primary.main} />
        </Head>
    )
}

export default Meta
