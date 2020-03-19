import { HSLColor } from 'react-color'
import { toHslaStr } from './helpers'

export type PreDefinedPalette = {
    name?: string
    id: PaletteId
    colors: HSLColor[]
    gradient: string
}

const ids = ['b+y', 'b+w'] as const
export type PaletteId = typeof ids[number]

export const defaultPalettes: PreDefinedPalette[] = [
    {
        id: 'b+y',
        name: 'Blue & Yellow',
        colors: [
            { h: 37, s: 0.94, l: 0.53, a: 1 },
            { h: 214, s: 0.69, l: 0.39, a: 1 },
        ],
        gradient: '',
    },
    {
        id: 'b+w',
        name: 'Black & White',
        colors: [
            { h: 0, s: 0, l: 1, a: 1 },
            { h: 0, s: 0, l: 0, a: 1 },
        ],
        gradient: '',
    },
]

// Fill gradient
defaultPalettes.forEach((palette) => {
    const colors = palette.colors.map((color) => toHslaStr(color))
    // eslint-disable-next-line no-param-reassign
    palette.gradient = colors.join(', ')
})
