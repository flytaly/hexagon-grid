import set from 'lodash.set'
import clone from 'lodash.clonedeep'
import { HSLColor } from 'react-color'
import { CanvasState, PaletteColorsArray } from './canvas-state-types'

type ParamFn = (p: string | HSLColor | PaletteColorsArray) => string

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
    cell: {
        size: 's',
        orientation: (or) => (or === 'pointy' ? 'or=p' : 'or=f'),
        borderWidth: 'b',
        variance: 'v',
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
        type: (gt) => (gt === 'hexagons' ? 'gt=h' : 'gt=t'),
        sparse: 'gs',
        signX: 'gx',
        signY: 'gy',
    },
    colors: {
        border: (c) => `cb=${hslaToString(c as HSLColor)}`,
        background: 'cbg',
        palette: {
            isCustom: null,
            id: null,
            colors: (cols) =>
                `pal=${(cols as PaletteColorsArray).map((c) => hslaToString(c.hsl)).join(':')}`,
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

const paramToPalette = (param: string): PaletteColorsArray => {
    const result: PaletteColorsArray = []
    param.split(':').forEach((c, idx) => {
        result.push({ id: idx, hsl: paramToHSL(c) })
    })
    return result
}

const setNumberProp = (state: CanvasState, path: string, param: string) => {
    const p = Number(param)
    if (Number.isNaN(p)) return state
    return set(state, path, p)
}

export const mapParamToState: MapParamToState = {
    w: (p, s) => setNumberProp(s, 'canvasSize.width', p),
    h: (p, s) => setNumberProp(s, 'canvasSize.height', p),
    s: (p, s) => setNumberProp(s, 'cell.size', p),
    or: (p, s) => set(s, 'cell.orientation', p === 'p' ? 'pointy' : 'flat'),
    b: (p, s) => setNumberProp(s, 'cell.borderWidth', p),
    v: (p, s) => setNumberProp(s, 'cell.variance', p),
    seed: (p, s) => setNumberProp(s, 'noise.seed', p),
    nz: (p, s) => setNumberProp(s, 'noise.zoom', p),
    nh: (p, s) => setNumberProp(s, 'noise.hue', p),
    ns: (p, s) => setNumberProp(s, 'noise.saturation', p),
    nl: (p, s) => setNumberProp(s, 'noise.lightness', p),
    nx: (p, s) => setNumberProp(s, 'noise.offsetX', p),
    ny: (p, s) => setNumberProp(s, 'noise.offsetY', p),
    nid: (p, s) => set(s, 'noise.baseNoise.id', p), // TODO: check if exists
    n2: (p, s) => setNumberProp(s, 'noise.noise2Strength', p),
    gt: (p, s) => set(s, 'grid.type', p === 't' ? 'triangles' : 'hexagons'),
    gs: (p, s) => setNumberProp(s, 'grid.sparse', p),
    gx: (p, s) => setNumberProp(s, 'grid.signX', p),
    gy: (p, s) => setNumberProp(s, 'grid.signY', p),
    cb: (p, s) => set(s, 'colors.border', paramToHSL(p)),
    cbg: (p, s) => set(s, 'colors.background', paramToHSL(p)),
    pal: (p, s) => set(s, 'colors.palette.colors', paramToPalette(p)),
}

export function mapStateToUrlParams(state: CanvasState): string {
    const toParams = (obj: Record<string, unknown>, ids: Record<string, unknown>): string =>
        Object.entries(obj).reduce((acc, curr) => {
            const [key, value] = curr

            if (!ids || !ids[key] || value === null) return acc

            if (ids[key] instanceof Function) {
                const fn = ids[key] as ParamFn
                return `${acc}${fn(value as string | HSLColor | PaletteColorsArray)};`
            }

            if (typeof value === 'object' && value !== null) {
                return (
                    acc +
                    toParams(value as Record<string, unknown>, ids[key] as Record<string, unknown>)
                )
            }
            return `${acc}${ids[key]}=${value};`
        }, '')

    const urlParamString = toParams(state, stateObjectPropIds)

    return urlParamString.slice(0, -1) // remove the last ';'
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
