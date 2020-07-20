import { RGBColor } from 'react-color'
import nicePalettes from 'nice-color-palettes/1000'
import { toRGBaObj, toRGBAStr } from './helpers'
import paletteList from './palettes-list.json'

export type ColorPalette = {
    name?: string
    id: number | string
    colors: RGBColor[]
    setBackground?: RGBColor
    gradient: string
}

export type PaletteColorsArray = Array<{ rgb: RGBColor; id: string | number }>

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

export const defaultPalettes: ColorPalette[] = paletteList.map((p, idx) => {
    const colors = (p.colors as Array<string | ['string', number]>).map((c) =>
        Array.isArray(c) ? toRGBaObj(c[0], c[1]) : toRGBaObj(c),
    )
    const palette: ColorPalette = {
        id: idx,
        name: p.name,
        gradient: fillGradient(colors),
        colors,
    }
    if (p.background) palette.setBackground = toRGBaObj(p.background)
    return palette
})

export function getNicePalette(): PaletteColorsArray {
    let colors = nicePalettes[Math.floor(Math.random() * nicePalettes.length)]

    // Duplicate first and last colors so they make background.
    colors = [colors[0], ...colors, colors[colors.length - 1]]

    return colors.map((c, idx) => ({
        id: `${idx}_${Date.now()}`,
        rgb: toRGBaObj(c),
    }))
}
