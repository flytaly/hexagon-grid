import { clamp, mod } from '#/helpers'
import { Noises2DFns, Noises2DList } from '#/noises'
import { ColorPalette, defaultPalettes, fillGradient } from '#/palettes'
import { initialState, makePaletteColors } from './canvas-state'
import { ActionTypes, CanvasState, CanvasStateAction } from './canvas-state-types'
import { mapUrlParamsToState } from './url-state'

let hashMemo = ''
export const reducer = (state: CanvasState, action: CanvasStateAction): CanvasState => {
    switch (action.type) {
        case ActionTypes.RESET_SETTINGS: {
            const newState = { ...initialState }
            newState.canvasSize = state.canvasSize
            return newState
        }

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

        case ActionTypes.SELECT_NEXT_BASE_NOISE: {
            const { id } = state.noise.baseNoise
            const noises = Noises2DList.filter((n) => n !== 'image')
            const index = noises.indexOf(id as keyof Noises2DFns)
            const nextId = noises[(noises.length + index + action.payload) % noises.length]
            return {
                ...state,
                noise: {
                    ...state.noise,
                    baseNoise: {
                        ...state.noise.baseNoise,
                        id: nextId,
                    },
                },
            }
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
                        id: `custom-${state.colors.customPalettes.length}`,
                        colors: action.payload,
                    },
                },
            }

        case ActionTypes.TOGGLE_GRADIENT: {
            return { ...state, colors: { ...state.colors, isGradient: !state.colors.isGradient } }
        }

        case ActionTypes.SAVE_NEW_PALETTE: {
            const colorState = state.colors
            const customPaletteId = `custom_${Date.now()}`
            const hslArray = colorState.palette.colors.map((c) => c.rgb)
            const colorsWithId = makePaletteColors(hslArray, customPaletteId)
            const newCustomPalette: ColorPalette = {
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

        case ActionTypes.SELECT_NEXT_PALETTE: {
            const inc = action.payload || 1
            const currentPal = state.colors.palette
            let id: number = currentPal.isCustom ? 0 : Number(currentPal.id)
            id = Number.isNaN(id) ? 0 : mod(id + inc, defaultPalettes.length)
            const pal = defaultPalettes[id]
            return {
                ...state,
                colors: {
                    ...state.colors,
                    palette: {
                        isCustom: false,
                        id,
                        colors: makePaletteColors(pal.colors, id),
                    },
                    ...(pal.setBackground && { background: pal.setBackground }),
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

        case ActionTypes.INC_NOISE_ZOOM: {
            const inc = action.payload || 1
            const zoom = clamp(state.noise.zoom + inc, 1, 100)
            if (zoom === state.noise.zoom) return state
            return { ...state, noise: { ...state.noise, zoom } }
        }

        case ActionTypes.INC_CELL_SIZE: {
            const size = clamp(state.cell.size + action.payload, 1, 20)
            if (size === state.cell.size) return state
            return { ...state, cell: { ...state.cell, size } }
        }

        case ActionTypes.MERGE_STATE_FROM_QUERY: {
            const { payload } = action
            const hash = payload.hash.startsWith('#') ? payload.hash.slice(1) : payload.hash
            const params = {} as Record<string, string>

            if (hash && hash === hashMemo) return state

            for (const param of hash.split(';')) {
                const [name, value] = param.split('=')
                params[name] = value
            }

            const newState = mapUrlParamsToState(params, state)

            if (payload.skipCanvasSize) {
                newState.canvasSize = state.canvasSize
            }

            hashMemo = hash

            return newState
        }
        default:
            throw new Error()
    }
}
