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

export function toHslStr(color: HSLColor) {
    return `hsla(${color.h},${color.s * 100}%,${color.l * 100}%,${color.a})`
}
