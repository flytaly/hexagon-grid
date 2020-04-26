import { HSLColor } from 'react-color'
import { toHslaStr, toHslaObj } from './helpers'

export type SavedColorPalette = {
    name?: string
    id: PaletteId | string | number
    colors: HSLColor[]
    setBackground?: HSLColor
    gradient: string
}

const ids = ['b+y', 'grey', 'colorful', 'teal-green'] as const
export type PaletteId = typeof ids[number]

export const defaultPalettes: SavedColorPalette[] = [
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
    {
        id: 'b-go',
        name: 'Blue & Grayish Orange',
        colors: [
            toHslaObj('hsl(205, 57%, 28%)'), //
            toHslaObj('hsl(205, 51%, 38%)'),
            toHslaObj('hsl(204, 35%, 53%)'),
            toHslaObj('hsl(41, 34%, 80%)'),
            toHslaObj('hsl(41, 34%, 80%)'),
            toHslaObj('hsl(204, 35%, 53%)'),
            toHslaObj('hsl(205, 51%, 38%)'),
            toHslaObj('hsl(205, 57%, 28%)'),
        ],
        gradient: '',
    },
    {
        id: 'cs01',
        name: 'colorschemer-01',
        colors: [
            toHslaObj('hsl(204, 10%, 39%)'),
            toHslaObj('hsl(280, 10%, 39%)'),
            toHslaObj('hsl(349, 55%, 62%)'),
            toHslaObj('hsl(24, 100%, 65%)'),
        ],
        gradient: '',
    },
    {
        id: 'cs02',
        name: 'colorschemer-02',
        colors: [
            toHslaObj('hsl(312, 35%, 31%)'),
            toHslaObj('hsl(312, 35%, 31%)'),
            toHslaObj('hsl(311, 34%, 41%)'),
            toHslaObj('hsl(309, 33%, 51%)'),
            toHslaObj('hsl(309, 33%, 51%)'),
            toHslaObj('hsl(328, 31%, 57%)'),
            toHslaObj('hsl(347, 30%, 66%)'),
        ],
        gradient: '',
    },
    {
        id: 'cs03',
        name: 'colorschemer-03',
        colors: [
            toHslaObj('hsl(206, 39%, 72%)'),
            toHslaObj('hsl(206, 39%, 72%)'),
            toHslaObj('hsl(206, 39%, 72%)'),
            toHslaObj('hsl(60, 100%, 48%)'),
            toHslaObj('hsl(250, 55%, 58%)'),
            toHslaObj('hsl(250, 55%, 58%)'),
        ],
        gradient: '',
    },
    {
        id: 'cs04',
        name: 'colorschemer-04',
        colors: [
            toHslaObj('hsl(8, 96%, 36%)'),
            toHslaObj('hsl(48, 98%, 68%)'),
            toHslaObj('hsl(221, 35%, 43%)'),
            toHslaObj('hsl(221, 35%, 43%)'),
        ],
        gradient: '',
    },
    {
        id: 'cs05',
        name: 'colorschemer-05',
        colors: [
            toHslaObj('hsl(100, 8%, 85%)'),
            toHslaObj('hsl(100, 8%, 85%)'),
            toHslaObj('hsl(208, 46%, 43%)'),
            toHslaObj('hsl(242, 65%, 73%)'),
            toHslaObj('hsl(242, 65%, 73%)'),
            toHslaObj('hsl(242, 65%, 73%)'),
        ],
        gradient: '',
    },
    {
        id: 'cs06',
        name: 'colorschemer-06',
        colors: [
            toHslaObj('hsl(200, 83%, 38%)'),
            toHslaObj('hsl(200, 83%, 38%)'),
            toHslaObj('hsl(356, 94%, 87%)'),
            toHslaObj('hsl(1, 98%, 66%)'),
        ],
        gradient: '',
    },
    {
        id: 'cs07',
        name: 'colorschemer-07',
        colors: [
            toHslaObj('hsl(10, 78%, 75%)'),
            toHslaObj('hsl(10, 78%, 75%)'),
            toHslaObj('hsl(10, 78%, 75%)'),
            toHslaObj('hsl(9, 17%, 52%)'),
            toHslaObj('hsl(203, 11%, 39%)'),
            toHslaObj('hsl(203, 11%, 39%)'),
            toHslaObj('hsl(203, 11%, 39%)'),
            toHslaObj('hsl(203, 11%, 39%)'),
            toHslaObj('hsl(203, 11%, 39%)'),
        ],
        gradient: '',
    },
    {
        id: 'cs08',
        name: 'colorschemer-08',
        colors: [
            toHslaObj('hsl(92, 27%, 47%)'),
            toHslaObj('hsl(92, 27%, 47%)'),
            toHslaObj('hsl(92, 27%, 47%)'),
            toHslaObj('hsl(92, 27%, 47%)'),
            toHslaObj('hsl(51, 100%, 47%)'),
            toHslaObj('hsl(165, 4%, 21%)'),
            toHslaObj('hsl(165, 4%, 21%)'),
        ],
        gradient: '',
    },
]

export const fillGradient = (palette: SavedColorPalette) => {
    const { length } = palette.colors
    // eslint-disable-next-line no-param-reassign
    palette.gradient = palette.colors.reduce((acc, color, idx) => {
        let result = acc + toHslaStr(color)

        const step = 100 / length
        if (idx > 0) result += ` ${Math.round(step * idx)}%` // left
        if (idx < length - 1) result += ` ${Math.round(step * (idx + 1))}%,` // right

        return result
    }, '')
}

// Fill discrete gradient
defaultPalettes.forEach(fillGradient)
