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
