import * as Honeycomb from 'honeycomb-grid'

import { clamp } from '#/helpers'
import { getNoises } from '#/noises'
import { CanvasState } from '#/state/canvas-state-types'
import { PolygonData } from './draw-polygons'
import { getHexCellSize } from './get-sizes'
import { getNoiseFn } from './noise'

import { getColorPickerFn, setFillColor, setFillColorFromImg } from './fill'

type HexSetArgs = {
    q: number
    r: number
    s: number
}

type OnCreateCallBack = Honeycomb.onCreateCallback<
    Honeycomb.Hex<{ set: (args: HexSetArgs) => void }>
>

export function genHexData(state: CanvasState, imgData?: Uint8ClampedArray | null): PolygonData {
    const { orientation } = state.cell
    const { zoom, baseNoise, noise2Strength } = state.noise
    const { sparse, signX, signY, isXYSwapped } = state.grid
    const isImg = baseNoise.id === 'image' && Boolean(imgData)

    const [noises, random] = getNoises(String(state.noise.seed))
    const sizes = getHexCellSize(state.cell, state.canvasSize, state.grid)

    const Hex = Honeycomb.extendHex({ size: sizes.hexSize, orientation })
    const Grid = Honeycomb.defineGrid(Hex)

    const onCreate: OnCreateCallBack = (hex) => {
        hex.set({ q: hex.q * sparse, r: hex.r * sparse, s: hex.s * sparse })
    }

    const grid = Grid.rectangle({
        width: sizes.cellsNumW,
        height: sizes.cellsNumH,
        start: [-1, -1],
        onCreate: sparse !== 1 ? onCreate : undefined,
    })

    const palette = state.colors.palette.colors

    const vertices = new Float32Array(grid.length * 6 * 2)
    const fillColors = new Float32Array(grid.length * 4)
    const result: PolygonData = { vertices, fillColors, type: 'hexagons' }

    const noiseFn = getNoiseFn(noises, baseNoise)
    if (!palette.length || !noiseFn) return result

    const getColor = getColorPickerFn(palette, state.colors.isGradient)

    const getRandomNoiseVal = () => (noise2Strength ? random.rnd(noise2Strength) : 0)
    const getNoiseVal = (cx: number, cy: number) => {
        const x = isXYSwapped ? signY * cy : signX * cx
        const y = isXYSwapped ? signX * cx : signY * cy
        return clamp(noiseFn(x, y, sizes.normalW, sizes.normalH) + getRandomNoiseVal(), -1, 1)
    }

    grid.forEach((hexagon, idx) => {
        if (isImg) {
            const col = clamp(Math.ceil(hexagon.x), 0, sizes.cellsNumW)
            const row = clamp(Math.ceil(hexagon.y), 0, sizes.cellsNumH)

            setFillColorFromImg(
                row * sizes.cellsNumW + col,
                imgData as Uint8ClampedArray,
                fillColors,
                idx,
                getRandomNoiseVal(),
                state.noise,
            )
        } else {
            const [cx, cy] = [
                (hexagon.x - (sparse * sizes.cellsNumW) / 2 + state.noise.offsetX + 1) / zoom,
                (hexagon.y - (sparse * sizes.cellsNumH) / 2 + state.noise.offsetY + 1) / zoom,
            ]
            setFillColor(getNoiseVal(cx, cy), state.noise, getColor, fillColors, idx)
        }

        const point = hexagon.toPoint()
        hexagon.corners().forEach((corner, cornerIdx) => {
            const { x, y } = corner.add(point)
            vertices[idx * 12 + cornerIdx * 2] = x
            vertices[idx * 12 + cornerIdx * 2 + 1] = y
        })
    })
    return result
}
