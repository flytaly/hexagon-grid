import { HSLColor } from 'react-color'
import { clamp } from './helpers'
import { Noises2D, Noises2DFns } from './noises'
import { PaletteId, defaultPalettes, SavedColorPalette, fillGradient } from './palettes'

export enum ActionTypes {
    SET_SIZE = 'SET_SIZE',
    SET_HEX_OPTIONS = 'SET_HEX_OPTIONS',
    SET_NOISE_OPTIONS = 'SET_NOISE_OPTIONS',
    SET_GRID_OPTIONS = 'SET_GRID_OPTIONS',
    SET_COLOR_OPTIONS = 'SET_COLOR_OPTIONS',
    MODIFY_PALETTE = 'MODIFY_PALETTE',
    SAVE_NEW_PALETTE = 'SAVE_NEW_PALETTE',
    INC_NOISE_OFFSET = 'INC_NOISE_OFFSET',
    INC_HEX_SIZE = 'INC_HEX_SIZE',
}

export type CanvasSize = {
    width: number
    height: number
    aspect: number
    pixelRatio: number
    wasMeasured: boolean
}

export type HexSettings = {
    size: number
    orientation: 'pointy' | 'flat'
    borderWidth: number
}

export type NoiseSettings = {
    zoom: number
    seed: number | string
    hue: number
    saturation: number
    lightness: number
    offsetX: number
    offsetY: number
    baseNoise: keyof Noises2DFns
    noise2Strength: number
}

export type GridSettings = {
    sparse: number
    signX: 1 | -1
    signY: 1 | -1
}

export type paletteColorsArray = Array<{ hsl: HSLColor; id: string | number }>

export type ColorsSettings = {
    hexBorder: HSLColor
    background: HSLColor | null
    palette: {
        isCustom: boolean
        id: PaletteId | string | number
        colors: paletteColorsArray
    }
    customPalettes: SavedColorPalette[]
}

export type CanvasState = {
    canvasSize: CanvasSize
    hex: HexSettings
    noise: NoiseSettings
    grid: GridSettings
    colors: ColorsSettings
}

export type CanvasStateAction =
    | { type: ActionTypes.SET_SIZE; payload: Partial<CanvasSize> }
    | { type: ActionTypes.SET_HEX_OPTIONS; payload: Partial<HexSettings> }
    | { type: ActionTypes.SET_NOISE_OPTIONS; payload: Partial<NoiseSettings> }
    | { type: ActionTypes.SET_GRID_OPTIONS; payload: Partial<GridSettings> }
    | { type: ActionTypes.SET_COLOR_OPTIONS; payload: Partial<ColorsSettings> }
    | { type: ActionTypes.MODIFY_PALETTE; payload: paletteColorsArray }
    | { type: ActionTypes.INC_NOISE_OFFSET; payload: { dx?: number; dy?: number } }
    | { type: ActionTypes.INC_HEX_SIZE; payload: number }
    | { type: ActionTypes.SAVE_NEW_PALETTE }

export const makePaletteColors = (colors: HSLColor[], paletteId: number | string) => {
    return colors.map((hsl, index) => ({
        id: `${paletteId}-${index}`,
        hsl,
    })) as paletteColorsArray
}

export const initialState: CanvasState = {
    canvasSize: {
        width: 1920,
        height: 1080,
        aspect: 1920 / 1080,
        pixelRatio: 1,
        wasMeasured: false,
    },
    hex: {
        size: 3,
        orientation: 'pointy',
        borderWidth: 1,
    },
    noise: {
        seed: Math.random(),
        zoom: 10,
        hue: 2,
        saturation: 2,
        lightness: 4,
        offsetX: 0,
        offsetY: 0,
        baseNoise: Noises2D.diagonal.id,
        noise2Strength: 0,
    },
    grid: {
        sparse: 1,
        signX: 1,
        signY: 1,
    },
    colors: {
        hexBorder: { h: 0, s: 0, l: 1, a: 1 },
        background: null,
        palette: {
            isCustom: false,
            id: defaultPalettes[1].id,
            colors: makePaletteColors(defaultPalettes[1].colors, defaultPalettes[1].id),
        },
        customPalettes: [],
    },
}

export const reducer = (state: CanvasState, action: CanvasStateAction): CanvasState => {
    switch (action.type) {
        case ActionTypes.SET_SIZE: {
            const canvasSize = { ...state.canvasSize, wasMeasured: true, ...action.payload }
            canvasSize.aspect = canvasSize.width / canvasSize.height
            return { ...state, canvasSize }
        }
        case ActionTypes.SET_HEX_OPTIONS:
            return { ...state, hex: { ...state.hex, ...action.payload } }
        case ActionTypes.SET_GRID_OPTIONS:
            return { ...state, grid: { ...state.grid, ...action.payload } }
        case ActionTypes.SET_NOISE_OPTIONS:
            return { ...state, noise: { ...state.noise, ...action.payload } }
        case ActionTypes.SET_COLOR_OPTIONS:
            return { ...state, colors: { ...state.colors, ...action.payload } }
        case ActionTypes.MODIFY_PALETTE:
            return {
                ...state,
                colors: {
                    ...state.colors,
                    palette: {
                        isCustom: true,
                        id: state.colors.customPalettes.length,
                        colors: action.payload,
                    },
                },
            }
        case ActionTypes.SAVE_NEW_PALETTE: {
            const colorState = state.colors
            const customPaletteId = colorState.customPalettes.length
            const hslArray = colorState.palette.colors.map((c) => c.hsl)
            const colorsWithId = makePaletteColors(hslArray, `custom_${customPaletteId}`)

            const newCustomPalette: SavedColorPalette = {
                id: customPaletteId,
                colors: hslArray,
                gradient: '',
            }
            fillGradient(newCustomPalette)

            return {
                ...state,
                colors: {
                    ...colorState,
                    palette: {
                        isCustom: true,
                        id: customPaletteId,
                        colors: colorsWithId,
                    },
                    customPalettes: [newCustomPalette, ...colorState.customPalettes],
                },
            }
        }
        case ActionTypes.INC_NOISE_OFFSET: {
            const { dx = 0, dy = 0 } = action.payload
            return {
                ...state,
                noise: {
                    ...state.noise,
                    offsetX: state.noise.offsetX + dx,
                    offsetY: state.noise.offsetY + dy,
                },
            }
        }
        case ActionTypes.INC_HEX_SIZE: {
            const size = clamp(state.hex.size + action.payload, 1, 20)
            if (size === state.hex.size) return state
            return { ...state, hex: { ...state.hex, size } }
        }
        default:
            throw new Error()
    }
}
