import { RGBColor } from 'react-color'
import { clamp, genSeed } from './helpers'
import { defaultPalettes, SavedColorPalette, fillGradient } from './palettes'
import { mapUrlParamsToState } from './url-state'
import {
    ActionTypes,
    PaletteColorsArray,
    CanvasState,
    CanvasStateAction,
} from './canvas-state-types'
import { Noises2D } from './noises'

export const makePaletteColors = (colors: RGBColor[], paletteId: number | string) => {
    return colors.map((rgb, index) => ({
        id: `${paletteId}-${index}`,
        rgb,
    })) as PaletteColorsArray
}

export const initialState: CanvasState = {
    canvasSize: {
        width: 1920,
        height: 1080,
        aspect: 1920 / 1080,
        pixelRatio: 1,
        wasMeasured: false,
    },
    cell: {
        size: 4,
        orientation: 'pointy', // for hexagons only
        variance: 10,
        borderWidth: 1,
    },
    noise: {
        seed: genSeed(),
        zoom: 10,
        hue: 2,
        saturation: 2,
        lightness: 4,
        offsetX: 0,
        offsetY: 0,
        baseNoise: {
            id: Noises2D.diagonal.id,
            // id: 'custom',
            customFn: 'sin(x*2) + y*2',
        },
        noise2Strength: 0,
        imageDataString: '',
    },
    grid: {
        type: 'triangles',
        sparse: 1,
        signX: 1,
        signY: 1,
    },
    colors: {
        border: { r: 100, g: 100, b: 100, a: 0.1 },
        useBodyColor: false,
        background: null,
        noFill: false,
        isGradient: false,
        palette: {
            isCustom: false,
            id: defaultPalettes[0].id,
            colors: makePaletteColors(defaultPalettes[0].colors, defaultPalettes[0].id),
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
        case ActionTypes.SET_CELL_OPTIONS: {
            const keys = Object.keys(action.payload)
            if (
                keys.length === 1 &&
                keys[0] === 'size' &&
                action.payload.size === state.cell.size
            ) {
                return state
            }
            return { ...state, cell: { ...state.cell, ...action.payload } }
        }
        case ActionTypes.SET_GRID_OPTIONS:
            return { ...state, grid: { ...state.grid, ...action.payload } }
        case ActionTypes.SET_NOISE_OPTIONS:
            return {
                ...state,
                noise: {
                    ...state.noise,
                    ...action.payload,
                    baseNoise: {
                        ...state.noise.baseNoise,
                        ...action.payload.baseNoise,
                    },
                },
            }
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
            const hslArray = colorState.palette.colors.map((c) => c.rgb)
            const colorsWithId = makePaletteColors(hslArray, `custom_${customPaletteId}`)

            const newCustomPalette: SavedColorPalette = {
                id: customPaletteId,
                colors: hslArray,
                gradient: fillGradient(hslArray),
            }

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
        case ActionTypes.INC_CELL_SIZE: {
            const size = clamp(state.cell.size + action.payload, 1, 20)
            if (size === state.cell.size) return state
            return { ...state, cell: { ...state.cell, size } }
        }
        case ActionTypes.MERGE_STATE_FROM_QUERY: {
            const params = {} as Record<string, string>
            for (const param of action.payload.split(';')) {
                const [name, value] = param.split('=')
                params[name] = value
            }

            return mapUrlParamsToState(params, state)
        }
        default:
            throw new Error()
    }
}
