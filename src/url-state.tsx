import set from 'lodash.set'
import clone from 'lodash.clonedeep'
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

type SetState = (param: string, state: CanvasState) => CanvasState

type MapParamToState = { [name: string]: SetState }

const paramToHSL = (param: string): HSLColor => {
    const [h, s, l, a = 100] = param.split(',')
    return { h: Number(h), s: +s / 100, l: +l / 100, a: +a / 100 }
}

const paramToPalette = (param: string): paletteColorsArray => {
    const result: paletteColorsArray = []
    param.split(':').forEach((c, idx) => {
        result.push({ id: idx, hsl: paramToHSL(c) })
    })
    return result
}

export const mapParamToState: MapParamToState = {
    w: (p, s) => set(s, 'canvasSize.width', Number(p)),
    h: (p, s) => set(s, 'canvasSize.height', Number(p)),
    s: (p, s) => set(s, 'hex.size', Number(p)),
    or: (p, s) => set(s, 'hex.orientation', p === 'p' ? 'pointy' : 'flat'),
    b: (p, s) => set(s, 'hex.borderWidth', Number(p)),
    seed: (p, s) => set(s, 'noise.seed', Number(p)),
    nz: (p, s) => set(s, 'noise.zoom', Number(p)),
    nh: (p, s) => set(s, 'noise.hue', Number(p)),
    ns: (p, s) => set(s, 'noise.saturation', Number(p)),
    nl: (p, s) => set(s, 'noise.lightness', Number(p)),
    nx: (p, s) => set(s, 'noise.offsetX', Number(p)),
    ny: (p, s) => set(s, 'noise.offsetY', Number(p)),
    nid: (p, s) => set(s, 'noise.baseNoise.id', p), // TODO: check if exists
    n2: (p, s) => set(s, 'noise.noise2Strength', Number(p)),
    gs: (p, s) => set(s, 'grid.sparse', Number(p)),
    gx: (p, s) => set(s, 'grid.signX', Number(p)),
    gy: (p, s) => set(s, 'grid.signY', Number(p)),
    cb: (p, s) => set(s, 'colors.hexBorder', paramToHSL(p)),
    cbg: (p, s) => set(s, 'colors.background', paramToHSL(p)),
    pal: (p, s) => set(s, 'colors.palette.colors', paramToPalette(p)),
    // pal: 'colors.palette.colors',
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

export function mapUrlParamsToState(
    params: Record<string, string>,
    oldState: CanvasState,
): CanvasState {
    const state = clone(oldState)
    const entries = Object.entries(params) as [keyof typeof mapParamToState, string][]

    for (const [key, value] of entries) {
        const fn = mapParamToState[key]
        if (fn && value) fn(value, state)
    }
    state.canvasSize.wasMeasured = true
    state.canvasSize.aspect = state.canvasSize.width / state.canvasSize.height
    state.colors.palette.isCustom = true
    state.colors.palette.id = state.colors.customPalettes.length

    return state
}
