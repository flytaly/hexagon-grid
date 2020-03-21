import { HSLColor } from 'react-color'

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
    return `hsla(${color.h},${color.s * 100}%,${color.l * 100}%,${color.a})`
}

export function toHslaObj(hslStr: string, alpha = 1): HSLColor {
    const re = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g
    const regExpArray = re.exec(hslStr)

    if (!regExpArray) throw new SyntaxError('Not an HSL color')

    const [, h, s, l] = regExpArray
    return { h: +h, s: +s / 100, l: +l / 100, a: alpha }
}
