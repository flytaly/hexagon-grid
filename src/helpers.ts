/* eslint-disable no-param-reassign */
import { HSLColor, RGBColor } from 'react-color'

/**
 * @param x start of the range
 * @param y end of the range
 * @param a interpolation value ∈ [0,1]
 */
export function lerp(x: number, y: number, a: number) {
    return (1 - a) * x + a * y
}

export function clamp(n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max)
}

export function toHslaStr(color: HSLColor) {
    return `hsla(${color.h},${Math.round(color.s * 100)}%,${Math.round(color.l * 100)}%,${color.a})`
}

export function toRGBAStr(color: RGBColor) {
    return `rgba(${color.r},${Math.round(color.g)},${Math.round(color.b)},${color.a})`
}

export function toHslaObj(hslStr: string, alpha = 1): HSLColor {
    const re = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g
    const regExpArray = re.exec(hslStr)

    if (!regExpArray) throw new SyntaxError('Not an HSL color')

    const [, h, s, l] = regExpArray
    return { h: +h, s: +s / 100, l: +l / 100, a: alpha }
}

export function toRGBaObj(rgbHexStr: string, alpha = 1): RGBColor {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    const hex = rgbHexStr.replace(shorthandRegex, (m, r, g, b) => {
        return r + r + g + g + b + b
    })

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

    if (!result) {
        throw new SyntaxError(`Not an RGB color: ${rgbHexStr}`)
    }
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: alpha,
    }
}

export function genSeed(): number {
    return Math.round(Math.random() * 10000000)
}

// https://stackoverflow.com/questions/2348597/why-doesnt-this-javascript-rgb-to-hsl-code-work/54071699#54071699
export function rgbToHsl(r: number, g: number, b: number) {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max === min) {
        ;[h, s] = [0, 0] // achromatic
    } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
            default:
                break
        }
        h /= 6
    }

    return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)]
}
