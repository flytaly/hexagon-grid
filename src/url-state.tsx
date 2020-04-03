import { HSLColor } from 'react-color'
import { CanvasState, paletteColorsArray } from './canvas-state'

type ParamFn = (p: string | HSLColor | paletteColorsArray) => string

export type ObjectPropToStrMap<T> = {
    [P in keyof T]: ObjectPropToStrMap<T[P]> | string | null | ParamFn
}

const hslaToString = ({ h, s, l, a = 1 }: HSLColor) => {
    const base = `${h},${Math.round(s * 100)},${Math.round(l * 100)}`
    return a === 1 ? base : `${base},${Math.round(a * 100)}`
}

export const stateObjectPropIds: ObjectPropToStrMap<CanvasState> = {
    canvasSize: {
        width: 'w',
        height: 'h',
        aspect: null,
        pixelRatio: null,
        wasMeasured: null,
    },
    hex: {
        size: 's',
        orientation: (or) => (or === 'pointy' ? 'or=p' : 'or=f'),
        borderWidth: 'b',
    },
    noise: {
        seed: 'seed',
        zoom: 'nz',
        hue: 'nh',
        saturation: 'ns',
        lightness: 'nl',
        offsetX: 'nx',
        offsetY: 'ny',
        baseNoise: {
            id: 'nid',
            customFn: null,
        },
        noise2Strength: 'n2',
    },
    grid: {
        sparse: 'gs',
        signX: 'gx',
        signY: 'gy',
    },
    colors: {
        hexBorder: (c) => `cb=${hslaToString(c as HSLColor)}`,
        background: 'cbg',
        palette: {
            isCustom: null,
            id: null,
            colors: (cols) =>
                `pal=${(cols as paletteColorsArray).map((c) => hslaToString(c.hsl)).join(':')}`,
        },
        customPalettes: null,
    },
}

export function mapStateToUrlParams(state: CanvasState): string {
    const toParams = (obj: Record<string, unknown>, ids: Record<string, unknown>): string =>
        Object.entries(obj).reduce((acc, curr) => {
            const [key, value] = curr

            if (!ids || !ids[key] || value === null) return acc

            if (ids[key] instanceof Function) {
                const fn = ids[key] as ParamFn
                return `${acc}${fn(value as string | HSLColor | paletteColorsArray)}&`
            }

            if (typeof value === 'object' && value !== null) {
                return (
                    acc +
                    toParams(value as Record<string, unknown>, ids[key] as Record<string, unknown>)
                )
            }
            return `${acc}${ids[key]}=${value}&`
        }, '')

    const urlParamString = toParams(state, stateObjectPropIds)

    return urlParamString.slice(0, -1) // remove the last '&'
}
