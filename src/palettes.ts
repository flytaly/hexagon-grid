import { HSLColor } from 'react-color'
import { toHslaStr, toHslaObj } from './helpers'

export type PreDefinedPalette = {
    name?: string
    id: PaletteId
    colors: HSLColor[]
    setBackground?: HSLColor
    gradient: string
}

const ids = ['b+y', 'grey', 'colorful', 'teal-green'] as const
export type PaletteId = typeof ids[number]

export const defaultPalettes: PreDefinedPalette[] = [
    {
        id: 'b+y',
        name: 'Blue & Yellow',
        colors: [
            toHslaObj('hsl(37, 94%, 53%)'), //
            toHslaObj('hsl(214, 69%, 39%)'),
        ],
        gradient: '',
    },
    {
        // from https://uhdpixel.com/wall/minimalist-abstract-hexagon-colorful-4k-a1949/
        id: 'colorful',
        name: 'colorful palette',
        colors: [
            toHslaObj('hsl(202, 94%, 61%)'),
            toHslaObj('hsl(200, 89%, 60%)'),
            toHslaObj('hsl(196, 84%, 60%)'),
            toHslaObj('hsl(178, 68%, 57%)'),
            toHslaObj('hsl(134, 30%, 73%)'),
            toHslaObj('hsl(37, 86%, 67%)'),
            toHslaObj('hsl(9, 89%, 70%)'),
            toHslaObj('hsl(352, 80%, 66%)'),
            toHslaObj('hsl(329, 28%, 49%)'),
            toHslaObj('hsl(235, 23%, 43%)'),
            toHslaObj('hsl(198, 62%, 32%)'),
            toHslaObj('hsl(198, 62%, 32%)'),
        ],
        gradient: '',
    },
    {
        id: 'grey',
        name: 'Grey',
        colors: [
            toHslaObj('hsl(0, 0%, 80%)'),
            toHslaObj('hsl(0, 0%, 60%)'),
            toHslaObj('hsl(0, 0%, 50%)'),
            toHslaObj('hsl(0, 0%, 40%)'),
            toHslaObj('hsl(0, 0%, 20%)'),
        ],
        gradient: '',
    },
    {
        id: 'teal-green',
        name: 'Teal & Green',
        colors: [
            toHslaObj('hsl(330, 4%, 9%)', 0),
            toHslaObj('hsl(330, 4%, 9%)', 0),
            toHslaObj('hsl(181, 58%, 40%)'),
            toHslaObj('hsl(181, 58%, 40%)'),
            toHslaObj('hsl(72, 60%, 50%)'),
            toHslaObj('hsl(72, 60%, 50%)'),
            toHslaObj('hsl(330, 4%, 9%)', 0),
            toHslaObj('hsl(330, 4%, 9%)', 0),
        ],
        gradient: '',
        setBackground: toHslaObj('hsl(0, 0%, 0%)'),
    },
]

// Fill discrete gradient
defaultPalettes.forEach((palette) => {
    const { length } = palette.colors
    // eslint-disable-next-line no-param-reassign
    palette.gradient = palette.colors.reduce((acc, color, idx) => {
        let result = acc + toHslaStr(color)

        const step = 100 / length
        if (idx > 0) result += ` ${step * idx}%` // left
        if (idx < length - 1) result += ` ${step * (idx + 1)}%,` // right

        return result
    }, '')
})
