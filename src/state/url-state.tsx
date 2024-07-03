import clone from 'lodash.clonedeep'
import set from 'lodash.set'
import { RGBColor } from 'react-color'

import { toRGBaObj } from '#/helpers'
import { ColorPalette, fillGradient, PaletteColorsArray } from '#/palettes'
import { initialState } from './canvas-state'
import { CanvasState, GridType } from './canvas-state-types'

type ParamFn = (p: string | RGBColor | PaletteColorsArray | GridType) => string

export type ObjectPropToStrMap<T> = {
    [P in keyof T]: ObjectPropToStrMap<T[P]> | string | null | ParamFn
}
/*
const hslaToString = ({ h, s, l, a = 1 }: HSLColor) => {
    const base = `${h},${Math.round(s * 100)},${Math.round(l * 100)}`
    return a === 1 ? base : `${base},${Math.round(a * 100)}`
} */

const toHex = (n: number) => n.toString(16).padStart(2, '0')

const rgbaToString = ({ r, g, b, a = 1 }: RGBColor) => {
    const base = `${toHex(r)}${toHex(g)}${toHex(b)}`
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
        imageDataString: null,
    },
    grid: {
        type: (gt) => {
            if (gt === 'voronoi') return 'gt=v'
            if (gt === 'triangles') return 'gt=t'
            return 'gt=h'
        },
        sparse: 'gs',
        signX: 'gx',
        signY: 'gy',
        isXYSwapped: (g) => (g ? 'gxy=y' : ''),
    },
    colors: {
        border: (c) => `cb=${rgbaToString(c as RGBColor)}`,
        useBodyColor: (c) => (c ? 'cbb=y' : ''),
        background: (c) => `cbg=${rgbaToString(c as RGBColor)}`,
        noFill: (noFill) => (noFill ? 'nf=y' : ''),
        isGradient: (isGradient) => (isGradient ? 'gr=y' : ''),
        palette: {
            isCustom: null,
            id: null,
            colors: (cols) =>
                `pal=${(cols as PaletteColorsArray).map((c) => rgbaToString(c.rgb)).join(':')}`,
        },
        customPalettes: null,
    },
}

type SetState = (param: string, state: CanvasState) => CanvasState

type MapParamToState = { [name: string]: SetState }

/* const paramToHSL = (param: string): HSLColor => {
    const [h, s, l, a = 100] = param.split(',')
    return { h: Number(h), s: +s / 100, l: +l / 100, a: +a / 100 }
} */

const paramToRGB = (param: string): RGBColor => {
    const [rgbStr, a = 100] = param.split(',')
    return toRGBaObj(rgbStr, +a / 100)
}

const paramToPalette = (param: string): PaletteColorsArray => {
    const result: PaletteColorsArray = []
    param.split(':').forEach((c, idx) => {
        result.push({ id: idx, rgb: paramToRGB(c) })
    })
    return result
}

const setNumberProp = (state: CanvasState, path: string, param: string) => {
    const p = Number(param)
    if (Number.isNaN(p)) return state
    return set(state, path, p)
}

const setGridType = (state: CanvasState, param: string) => {
    let p: GridType = 'hexagons'
    if (param === 't') p = 'triangles'
    if (param === 'v') p = 'voronoi'
    return set(state, 'grid.type', p)
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
    gt: (p, s) => setGridType(s, p),
    gs: (p, s) => setNumberProp(s, 'grid.sparse', p),
    gx: (p, s) => setNumberProp(s, 'grid.signX', p),
    gy: (p, s) => setNumberProp(s, 'grid.signY', p),
    gxy: (p, s) => set(s, 'grid.isXYSwapped', p === 'y' || false),
    cb: (p, s) => set(s, 'colors.border', paramToRGB(p)),
    cbb: (p, s) => set(s, 'colors.useBodyColor', p === 'y' || false),
    nf: (p, s) => set(s, 'colors.noFill', p === 'y' || false),
    gr: (p, s) => set(s, 'colors.isGradient', p === 'y' || false),
    cbg: (p, s) => set(s, 'colors.background', paramToRGB(p)),
    pal: (p, s) => set(s, 'colors.palette.colors', paramToPalette(p)),
}

export function mapStateToUrlParams(state: CanvasState): string {
    const toParams = (obj: Record<string, unknown>, ids: Record<string, unknown>): string =>
        Object.entries(obj).reduce((acc, curr) => {
            const [key, value] = curr

            if (!ids || !ids[key] || value === null) return acc

            if (ids[key] instanceof Function) {
                const fn = ids[key] as ParamFn
                const keyValuePair = fn(value as string | RGBColor | PaletteColorsArray)
                return keyValuePair ? `${acc}${keyValuePair};` : acc
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
    const state = clone(initialState)
    state.canvasSize = clone(oldState.canvasSize)
    const entries = Object.entries(params) as [keyof typeof mapParamToState, string][]

    for (const [key, value] of entries) {
        const fn = mapParamToState[key]
        if (fn && value) fn(value, state)
    }
    state.canvasSize.wasMeasured = true
    state.canvasSize.aspect = state.canvasSize.width / state.canvasSize.height
    state.colors.palette.isCustom = true

    const customPaletteId = `custom_${Date.now()}_${Math.random()}`
    state.colors.palette.id = customPaletteId

    const colorState = state.colors
    const hslArray = colorState.palette.colors.map((c) => c.rgb)
    const newCustomPalette: ColorPalette = {
        id: customPaletteId,
        colors: hslArray,
        gradient: fillGradient(hslArray),
    }
    state.colors.customPalettes = [...oldState.colors.customPalettes, newCustomPalette]

    return state
}
