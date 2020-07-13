import { RGBColor } from 'react-color'
import { toRGBaObj, toRGBAStr } from './helpers'
import paletteList from './palettes-list.json'

export type SavedColorPalette = {
    name?: string
    id: number
    colors: RGBColor[]
    setBackground?: RGBColor
    gradient: string
}

export type CustomColorPalette = {
    id: number | string
    colors: RGBColor[]
    gradient: string
}

export const fillGradient = (colors: RGBColor[]): string => {
    const { length } = colors
    return colors.reduce((acc, color, idx) => {
        let result = acc + toRGBAStr(color)

        const step = 100 / length
        if (idx > 0) result += ` ${Math.round(step * idx)}%` // left
        if (idx < length - 1) result += ` ${Math.round(step * (idx + 1))}%,` // right

        return result
    }, '')
}

export const defaultPalettes: SavedColorPalette[] = paletteList.map((p, idx) => {
    const colors = (p.colors as Array<string | ['string', number]>).map((c) =>
        Array.isArray(c) ? toRGBaObj(c[0], c[1]) : toRGBaObj(c),
    )
    const palette: SavedColorPalette = {
        id: idx,
        name: p.name,
        gradient: fillGradient(colors),
        colors,
    }
    if (p.background) palette.setBackground = toRGBaObj(p.background)
    return palette
})
