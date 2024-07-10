declare module '*.svg'
declare module 'nice-color-palettes/1000' {
    const colors: string[][]
    export default colors
}

declare type RootPage = '/' | '/gallery' | '/help' | '/shortcuts' | '/contacts'

declare type RGBColor = {
    a?: number | undefined
    b: number
    g: number
    r: number
}

declare type HSLColor = {
    a?: number | undefined
    h: number
    l: number
    s: number
}
