import { useEffect } from 'react'

const routeTitles: Record<RootPage, string> = {
    '/': 'editor',
    '/gallery': 'gallery',
    '/help': 'help',
    '/shortcuts': 'shortcuts',
    '/contacts': 'contacts',
}

function useSetTitle(route: RootPage) {
    useEffect(() => {
        let title = 'Hexagonal grid'
        title += routeTitles[route] ? ` -- ${routeTitles[route]}` : ''
        document.title = title
    }, [route])
}

export default useSetTitle
