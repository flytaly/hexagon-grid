import * as Honeycomb from 'honeycomb-grid'

import { clamp } from '#/helpers'
import { getNoises } from '#/noises'
import { CanvasState } from '#/state/canvas-state-types'
import { PolygonData } from './draw-polygons'
import { getHexCellSize } from './get-sizes'
import { getNoiseFn } from './noise'

import { getColorPickerFn, setFillColor, setFillColorFromImg } from './fill'

const sparseRect: (w: number, h: number, sparse: number) => Honeycomb.Traverser<Honeycomb.Hex> = (
    w,
    h,
    sparse,
) => {
    const rectTraverser = Honeycomb.rectangle({ width: w, height: h })
    return (hex) => {
        const res = rectTraverser(hex)
        if (sparse === 1) {
            return res
        }
        return res.map((h) => {
            return h.clone({ q: h.q * sparse, r: h.r * sparse, s: h.s * sparse })
        })
    }
}

export function genHexData(state: CanvasState, imgData?: Uint8ClampedArray | null): PolygonData {
    const { orientation } = state.cell
    const { zoom, baseNoise, noise2Strength } = state.noise
    const { sparse, signX, signY, isXYSwapped } = state.grid
    const isImg = baseNoise.id === 'image' && Boolean(imgData)

    const [noises, random] = getNoises(String(state.noise.seed))
    const sizes = getHexCellSize(state.cell, state.canvasSize, state.grid)

    const Tile = Honeycomb.defineHex({
        dimensions: { xRadius: sizes.hexSize, yRadius: sizes.hexSize },
        orientation:
            orientation == 'pointy' ? Honeycomb.Orientation.POINTY : Honeycomb.Orientation.FLAT,
    })

    const grid = new Honeycomb.Grid(Tile, sparseRect(sizes.cellsNumW, sizes.cellsNumH, sparse))

    const palette = state.colors.palette.colors

    const vertices = new Float32Array(grid.size * 6 * 2)
    const fillColors = new Float32Array(grid.size * 4)
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

    let idx = 0
    grid.forEach((hexagon) => {
        if (isImg) {
            const col = clamp(Math.ceil(hexagon.col), 0, sizes.cellsNumW)
            const row = clamp(Math.ceil(hexagon.row), 0, sizes.cellsNumH)

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
                (hexagon.col - (sparse * sizes.cellsNumW) / 2 + state.noise.offsetX + 1) / zoom,
                (hexagon.row - (sparse * sizes.cellsNumH) / 2 + state.noise.offsetY + 1) / zoom,
            ]
            setFillColor(getNoiseVal(cx, cy), state.noise, getColor, fillColors, idx)
        }

        hexagon.corners.forEach((corner, cornerIdx) => {
            vertices[idx * 12 + cornerIdx * 2] = corner.x
            vertices[idx * 12 + cornerIdx * 2 + 1] = corner.y
        })
        idx++
    })
    return result
}
