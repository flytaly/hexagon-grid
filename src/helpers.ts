/**
 * @param x start of the range
 * @param y end of the range
 * @param a interpolation value ∈ [0,1]
 */
export function lerp(x: number, y: number, a: number): number {
    return (1 - a) * x + a * y
}

export function clamp(n: number, min: number, max: number): number {
    return Math.min(Math.max(n, min), max)
}

export function mod(n: number, m: number): number {
    return ((n % m) + m) % m
}

export function toHslaStr(color: HSLColor): string {
    return `hsla(${color.h},${Math.round(color.s * 100)}%,${Math.round(color.l * 100)}%,${color.a})`
}

export function toRGBAStr(color: RGBColor): string {
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
    const hex = rgbHexStr.replace(shorthandRegex, (_m, r, g, b) => {
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

export function toRGBHex(rgb: RGBColor): string {
    const r = rgb.r.toString(16).padStart(2, '0')
    const g = rgb.g.toString(16).padStart(2, '0')
    const b = rgb.b.toString(16).padStart(2, '0')
    return `#${r}${g}${b}`
}

export function genSeed(): number {
    return Math.round(Math.random() * 10000000)
}

// https://stackoverflow.com/questions/2348597/why-doesnt-this-javascript-rgb-to-hsl-code-work/54071699#54071699
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max === min) {
        // eslint-disable-next-line no-extra-semi
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

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 */
export function hslToRgb(h: number, s: number, l: number): RGBColor {
    let r: number
    let g: number
    let b: number

    if (s === 0) {
        r = g = b = l // achromatic
    } else {
        const hue2rgb = function hue2rgb(p: number, q: number, t: number) {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle<T>(arr: [T]): [T] {
    let currentIndex: number = arr.length
    let temporaryValue: T
    let randomIndex: number

    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = arr[currentIndex]
        arr[currentIndex] = arr[randomIndex]
        arr[randomIndex] = temporaryValue
    }

    return arr
}
