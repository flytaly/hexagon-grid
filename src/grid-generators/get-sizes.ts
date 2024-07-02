import { CanvasSize, CellSettings, GridSettings } from '#/state/canvas-state-types'

export function getGridCellSizes(
    size: number,
    canvasSize: CanvasSize,
): {
    cellSize: number
    cellsNumW: number
    cellsNumH: number
    normalW: number
    normalH: number
} {
    const { width, height, aspect } = canvasSize

    const cellSize =
        aspect < 1 //
            ? (size * height * aspect) / 100
            : (size * width) / aspect / 100
    const cellsNumW = Math.ceil(width / cellSize)
    const cellsNumH = Math.ceil(height / cellSize)

    return {
        cellSize,
        cellsNumW,
        cellsNumH,
        normalW: aspect < 1 ? cellsNumW / 10 : cellsNumW / 10 / aspect,
        normalH: aspect < 1 ? (cellsNumH * aspect) / 10 : cellsNumH / 10,
    }
}

export function getHexCellSize(
    cellSettings: CellSettings,
    canvasSize: CanvasSize,
    gridSettings: GridSettings,
): {
    hexSize: number
    widthStep: number
    heightStep: number
    cellsNumW: number
    cellsNumH: number
    normalW: number
    normalH: number
} {
    const { width, height, aspect } = canvasSize
    const { sparse } = gridSettings

    const hexSize =
        aspect < 1
            ? (cellSettings.size * height * aspect) / 100
            : (cellSettings.size * width) / aspect / 100

    const widthStep = cellSettings.orientation === 'pointy' ? hexSize * Math.sqrt(3) : hexSize * 1.5
    const heightStep =
        cellSettings.orientation === 'pointy' ? hexSize * 1.5 : hexSize * Math.sqrt(3)
    const widthCount = width / widthStep + 1
    const heightCount = height / heightStep + 1
    const [cellsNumW, cellsNumH] = [
        Math.ceil(widthCount / sparse + (sparse > 1 ? 1 : 0)),
        Math.ceil(heightCount / sparse + (sparse > 1 ? 1 : 0)),
    ]
    const [normalW, normalH] = [
        aspect < 1 ? cellsNumW / 10 : cellsNumW / 10 / aspect,
        aspect < 1 ? (cellsNumH * aspect) / 10 : cellsNumH / 10,
    ]

    return {
        hexSize,
        widthStep,
        heightStep,
        cellsNumW,
        cellsNumH,
        normalW,
        normalH,
    }
}
