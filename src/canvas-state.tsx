export enum ActionTypes {
    SET_SIZE = 'SET_SIZE',
}

type Size = {
    width: number
    height: number
    pixelRatio: number
}

export type CanvasState = {
    size: Size
}

export type CanvasStateAction = { type: ActionTypes.SET_SIZE; payload: Partial<Size> }

export const initialState: CanvasState = {
    size: {
        width: 1920,
        height: 1080,
        pixelRatio: 1,
    },
}

export const reducer = (state: CanvasState, action: CanvasStateAction): CanvasState => {
    switch (action.type) {
        case ActionTypes.SET_SIZE:
            return { ...state, size: { ...state.size, ...action.payload } }
        default:
            throw new Error()
    }
}
