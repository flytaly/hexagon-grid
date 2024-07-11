import chroma from 'chroma-js'

import { clamp, rgbToHsl } from '#/helpers'
import { PaletteColorsArray } from '#/palettes'
import { NoiseSettings } from '#/state/canvas-state-types'

type GetColorFromRange = (n: number) => RGBColor

export function getColorPickerFn(
    palette: PaletteColorsArray,
    isGradient = true,
): GetColorFromRange {
    if (!isGradient) {
        return (n: number) => {
            const colorId = clamp(Math.floor(n * 0.999999 * palette.length), 0, palette.length - 1)
            return palette[colorId].rgb
        }
    }

    const fn = chroma
        .scale(palette.map(({ rgb }) => chroma.rgb(rgb.r, rgb.g, rgb.b).alpha(rgb.a || 0)))
        .mode('lrgb')

    return (n: number) => {
        const color = fn(n)
        const [r, g, b, a] = color.rgba()
        return { r, g, b, a }
    }
}

export function setFillColor(
    noiseValue: number,
    noise: NoiseSettings,
    getColor: GetColorFromRange,
    fillColors: Float32Array | Array<number>,
    index: number,
) {
    const { hue: H, saturation: S, lightness: L } = noise

    const colorId = clamp((noiseValue + 1) / 2, 0, 1)
    const color = getColor(colorId)

    const [h, s, l] = rgbToHsl(color.r, color.g, color.b)

    fillColors[index * 4] = Math.round(h + H * noiseValue) // hue
    fillColors[index * 4 + 1] = Math.round(s + S * noiseValue) // saturation
    fillColors[index * 4 + 2] = Math.round(l + L * noiseValue) // light
    fillColors[index * 4 + 3] = color.a || 0 // alpha
}

export function setFillColorFromImg(
    offset: number,
    imgData: Uint8ClampedArray,
    fillColors: Float32Array | Array<number>,
    index: number,
    noiseValue: number,
    noise: NoiseSettings,
) {
    const { hue: H, saturation: S, lightness: L } = noise
    const $offset = offset * 4
    const [h, s, l] = rgbToHsl(imgData[$offset], imgData[$offset + 1], imgData[$offset + 2])
    fillColors[index * 4] = Math.round(h + H * noiseValue) // hue
    fillColors[index * 4 + 1] = Math.round(s + S * noiseValue) // saturation
    fillColors[index * 4 + 2] = Math.round(l + L * noiseValue) // light
    fillColors[index * 4 + 3] = imgData[$offset + 3]
}
