import { RGBColor } from 'react-color'
import { toRGBaObj, toRGBAStr } from './helpers'

export type SavedColorPalette = {
    name?: string
    id: PaletteId | string | number
    colors: RGBColor[]
    setBackground?: RGBColor
    gradient: string
}

const ids = ['b+y', 'grey', 'colorful', 'teal-green'] as const
export type PaletteId = typeof ids[number]

export const defaultPalettes: SavedColorPalette[] = [
    {
        id: 'b+y',
        name: 'Blue & Yellow',
        colors: [
            toRGBaObj('#f8a116'), //
            toRGBaObj('#1f5aa8'),
        ],
        gradient: '',
    },
    {
        // from https://uhdpixel.com/wall/minimalist-abstract-hexagon-colorful-4k-a1949/
        id: 'colorful',
        name: 'colorful palette',
        colors: [
            toRGBaObj('#3eb4f9'),
            toRGBaObj('#3eb7f4'),
            toRGBaObj('#43c1ef'),
            toRGBaObj('#47dcd7'),
            toRGBaObj('#a5cfaf'),
            toRGBaObj('#f3bc62'),
            toRGBaObj('#f7836e'),
            toRGBaObj('#ee6375'),
            toRGBaObj('#a05a7e'),
            toRGBaObj('#545987'),
            toRGBaObj('#1f6684'),
            toRGBaObj('#1f6684'),
        ],
        gradient: '',
    },
    {
        id: 'grey',
        name: 'Grey',
        colors: [
            toRGBaObj('#cccccc'),
            toRGBaObj('#999999'),
            toRGBaObj('#808080'),
            toRGBaObj('#666666'),
            toRGBaObj('#333333'),
        ],
        gradient: '',
    },
    {
        id: 'teal-green',
        name: 'Teal & Green',
        colors: [
            toRGBaObj('#181617', 0),
            toRGBaObj('#181617', 0),
            toRGBaObj('#2b9fa1'),
            toRGBaObj('#2b9fa1'),
            toRGBaObj('#adcc33'),
            toRGBaObj('#adcc33'),
            toRGBaObj('#181617', 0),
            toRGBaObj('#181617', 0),
        ],
        gradient: '',
        setBackground: toRGBaObj('#000000'),
    },
    {
        id: 'b-go',
        name: 'Blue & Grayish Orange',
        colors: [
            toRGBaObj('#1f4e70'), //
            toRGBaObj('#2f6992'),
            toRGBaObj('#5d90b1'),
            toRGBaObj('#ddd2bb'),
            toRGBaObj('#ddd2bb'),
            toRGBaObj('#5d90b1'),
            toRGBaObj('#2f6992'),
            toRGBaObj('#1f4e70'),
        ],
        gradient: '',
    },
    {
        id: 'cs01',
        name: 'colorschemer-01',
        colors: [
            toRGBaObj('#5a656d'),
            toRGBaObj('#675a6d'),
            toRGBaObj('#d3697c'),
            toRGBaObj('#ff944d'),
        ],
        gradient: '',
    },
    {
        id: 'cs02',
        name: 'colorschemer-02',
        colors: [
            toRGBaObj('#6b3360'),
            toRGBaObj('#6b3360'),
            toRGBaObj('#8c457f'),
            toRGBaObj('#ab599f'),
            toRGBaObj('#ab599f'),
            toRGBaObj('#b36f94'),
            toRGBaObj('#c28e9a'),
        ],
        gradient: '',
    },
    {
        id: 'cs03',
        name: 'colorschemer-03',
        colors: [
            toRGBaObj('#9cbbd3'),
            toRGBaObj('#9cbbd3'),
            toRGBaObj('#9cbbd3'),
            toRGBaObj('#f5f500'),
            toRGBaObj('#6d59cf'),
            toRGBaObj('#6d59cf'),
        ],
        gradient: '',
    },
    {
        id: 'cs04',
        name: 'colorschemer-04',
        colors: [
            toRGBaObj('#b41b44'),
            toRGBaObj('#fddd5d'),
            toRGBaObj('#476094'),
            toRGBaObj('#476094'),
        ],
        gradient: '',
    },
    {
        id: 'cs05',
        name: 'colorschemer-05',
        colors: [
            toRGBaObj('#d8dcd6'),
            toRGBaObj('#d8dcd6'),
            toRGBaObj('#3b71a0'),
            toRGBaObj('#908de7'),
            toRGBaObj('#908de7'),
            toRGBaObj('#908de7'),
        ],
        gradient: '',
    },
    {
        id: 'cs06',
        name: 'colorschemer-06',
        colors: [
            toRGBaObj('#107cb1'),
            toRGBaObj('#107cb1'),
            toRGBaObj('#fdbfc3'),
            toRGBaObj('#fd5653'),
        ],
        gradient: '',
    },
    {
        id: 'cs07',
        name: 'colorschemer-07',
        colors: [
            toRGBaObj('#f19e8e'),
            toRGBaObj('#f19e8e'),
            toRGBaObj('#f19e8e'),
            toRGBaObj('#997670'),
            toRGBaObj('#59666e'),
            toRGBaObj('#59666e'),
            toRGBaObj('#59666e'),
            toRGBaObj('#59666e'),
            toRGBaObj('#59666e'),
        ],
        gradient: '',
    },
    {
        id: 'cs08',
        name: 'colorschemer-08',
        colors: [
            toRGBaObj('#769857'),
            toRGBaObj('#769857'),
            toRGBaObj('#769857'),
            toRGBaObj('#769857'),
            toRGBaObj('#f0cc00'),
            toRGBaObj('#333837'),
            toRGBaObj('#333837'),
        ],
        gradient: '',
    },
]

export const fillGradient = (palette: SavedColorPalette) => {
    const { length } = palette.colors
    // eslint-disable-next-line no-param-reassign
    palette.gradient = palette.colors.reduce((acc, color, idx) => {
        let result = acc + toRGBAStr(color)

        const step = 100 / length
        if (idx > 0) result += ` ${Math.round(step * idx)}%` // left
        if (idx < length - 1) result += ` ${Math.round(step * (idx + 1))}%,` // right

        return result
    }, '')
}

// Fill discrete gradient
defaultPalettes.forEach(fillGradient)
