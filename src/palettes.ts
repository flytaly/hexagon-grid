import { HSLColor } from 'react-color'
import { toHslaStr } from './helpers'

export type PreDefinedPalette = {
    name?: string
    id: PaletteId
    colors: HSLColor[]
    gradient: string
}

const ids = ['b+y', 'grey'] as const
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
        id: 'grey',
        name: 'Grey',
        colors: [
            { h: 0, s: 0, l: 0.8, a: 1 },
            { h: 0, s: 0, l: 0.6, a: 1 },
            { h: 0, s: 0, l: 0.4, a: 1 },
            { h: 0, s: 0, l: 0.2, a: 1 },
        ],
        gradient: '',
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
