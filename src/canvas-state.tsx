export enum ActionTypes {
    SET_SIZE = 'SET_SIZE',
    SET_HEX_OPTIONS = 'SET_HEX_OPTIONS',
    SET_NOISE_OPTIONS = 'SET_NOISE_OPTIONS',
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
        case ActionTypes.SET_NOISE_OPTIONS:
            return { ...state, noise: { ...state.noise, ...action.payload } }
        default:
            throw new Error()
    }
}
