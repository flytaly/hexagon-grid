import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ContactsPage from './pages/contacts'
import GalleryPage from './pages/gallery'
import HelpPage from './pages/help'
import Index from './pages/index'
import ShortcutsPage from './pages/shortcuts'
import theme from './theme'

const router = createBrowserRouter([
    {
        path: '/' as RootPage,
        element: <Index />,
    },
    {
        path: '/gallery' as RootPage,
        element: <GalleryPage />,
    },
    {
        path: '/help' as RootPage,
        element: <HelpPage />,
    },
    {
        path: '/shortcuts' as RootPage,
        element: <ShortcutsPage />,
    },
    {
        path: '/contacts' as RootPage,
        element: <ContactsPage />,
    },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>,
)
