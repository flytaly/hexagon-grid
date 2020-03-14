export enum ActionTypes {
    SET_SIZE = 'SET_SIZE',
    SET_HEX_OPTIONS = 'SET_HEX_OPTIONS',
    SET_NOISE_OPTIONS = 'SET_NOISE_OPTIONS',
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
}

export type CanvasState = {
    canvasSize: CanvasSize
    hex: HexSettings
    noise: NoiseSettings
}

export type CanvasStateAction =
    | { type: ActionTypes.SET_SIZE; payload: Partial<CanvasSize> }
    | { type: ActionTypes.SET_HEX_OPTIONS; payload: Partial<HexSettings> }
    | { type: ActionTypes.SET_NOISE_OPTIONS; payload: Partial<NoiseSettings> }
    | { type: ActionTypes.INC_NOISE_OFFSET; payload: { dx?: number; dy?: number } }
    | { type: ActionTypes.INC_HEX_SIZE; payload: number }

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
        // seed: Math.random(),
        seed: 0.1,
        zoom: 10,
        hue: 2,
        saturation: 2,
        lightness: 4,
        offsetX: 0,
        offsetY: 0,
    },
}

function clamp(n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max)
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
        case ActionTypes.SET_NOISE_OPTIONS:
            return { ...state, noise: { ...state.noise, ...action.payload } }
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
            console.log(size)
            return { ...state, hex: { ...state.hex, size } }
        }
        default:
            throw new Error()
    }
}
