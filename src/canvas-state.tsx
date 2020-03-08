export enum ActionTypes {
    SET_SIZE = 'SET_SIZE',
    SET_HEX_OPTIONS = 'SET_HEX_OPTIONS',
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
}

export type CanvasState = {
    canvasSize: CanvasSize
    hex: HexSettings
}

export type CanvasStateAction =
    | { type: ActionTypes.SET_SIZE; payload: Partial<CanvasSize> }
    | { type: ActionTypes.SET_HEX_OPTIONS; payload: Partial<HexSettings> }

export const initialState: CanvasState = {
    canvasSize: {
        width: 1920,
        height: 1080,
        aspect: 1920 / 1080,
        pixelRatio: 1,
        wasMeasured: false,
    },
    hex: {
        size: 5,
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
        default:
            throw new Error()
    }
}
