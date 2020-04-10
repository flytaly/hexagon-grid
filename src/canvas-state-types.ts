import { HSLColor } from 'react-color'
import { Noises2DFns } from './noises'
import { PaletteId, SavedColorPalette } from './palettes'

export enum ActionTypes {
    SET_SIZE = 'SET_SIZE',
    SET_CELL_OPTIONS = 'SET_CELL_OPTIONS',
    SET_NOISE_OPTIONS = 'SET_NOISE_OPTIONS',
    SET_GRID_OPTIONS = 'SET_GRID_OPTIONS',
    SET_COLOR_OPTIONS = 'SET_COLOR_OPTIONS',
    MERGE_STATE_FROM_QUERY = 'MERGE_STATE_FROM_QUERY',
    MODIFY_PALETTE = 'MODIFY_PALETTE',
    SAVE_NEW_PALETTE = 'SAVE_NEW_PALETTE',
    INC_NOISE_OFFSET = 'INC_NOISE_OFFSET',
    INC_CELL_SIZE = 'INC_CELL_SIZE',
}

export type CanvasSize = {
    width: number
    height: number
    aspect: number
    pixelRatio: number
    wasMeasured: boolean
}

export type CellSettings = {
    size: number
    orientation: 'pointy' | 'flat'
    borderWidth: number
    variance: number
}

export type BaseNoise = {
    id: keyof Noises2DFns | 'custom'
    customFn: string | null
}

export type NoiseSettings = {
    zoom: number
    seed: number | string
    hue: number
    saturation: number
    lightness: number
    offsetX: number
    offsetY: number
    baseNoise: BaseNoise
    noise2Strength: number
}

export type GridType = 'hexagons' | 'triangles' | 'voronoi'

export type GridSettings = {
    type: GridType
    sparse: number
    signX: 1 | -1
    signY: 1 | -1
}

export type PaletteColorsArray = Array<{ hsl: HSLColor; id: string | number }>

export type ColorsSettings = {
    border: HSLColor
    background: HSLColor | null
    palette: {
        isCustom: boolean
        id: PaletteId | string | number
        colors: PaletteColorsArray
    }
    customPalettes: SavedColorPalette[]
}

export type CanvasState = {
    canvasSize: CanvasSize
    cell: CellSettings
    noise: NoiseSettings
    grid: GridSettings
    colors: ColorsSettings
}

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>
}

export type CanvasStateAction =
    | { type: ActionTypes.SET_SIZE; payload: Partial<CanvasSize> }
    | { type: ActionTypes.SET_CELL_OPTIONS; payload: Partial<CellSettings> }
    | { type: ActionTypes.SET_NOISE_OPTIONS; payload: RecursivePartial<NoiseSettings> }
    | { type: ActionTypes.SET_GRID_OPTIONS; payload: Partial<GridSettings> }
    | { type: ActionTypes.SET_COLOR_OPTIONS; payload: Partial<ColorsSettings> }
    | { type: ActionTypes.MERGE_STATE_FROM_QUERY; payload: string }
    | { type: ActionTypes.MODIFY_PALETTE; payload: PaletteColorsArray }
    | { type: ActionTypes.INC_NOISE_OFFSET; payload: { dx?: number; dy?: number } }
    | { type: ActionTypes.INC_CELL_SIZE; payload: number }
    | { type: ActionTypes.SAVE_NEW_PALETTE }
