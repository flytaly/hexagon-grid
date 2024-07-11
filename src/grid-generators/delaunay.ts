import { Delaunay } from 'd3-delaunay'

import { clamp } from '#/helpers'
import { getNoises } from '#/noises'
import { CanvasState, GridType } from '#/state/canvas-state-types'
import { PolygonData } from './draw-polygons'
import { getColorPickerFn, setFillColor, setFillColorFromImg } from './fill'
import { getGridCellSizes } from './get-sizes'
import { getNoiseFn } from './noise'

export function genDelaunayData(
    state: CanvasState,
    type = 'triangles' as GridType,
    imgData?: Uint8ClampedArray | null,
): PolygonData {
    const { width, height } = state.canvasSize
    const { zoom, baseNoise, noise2Strength } = state.noise
    const [noises, random] = getNoises(String(state.noise.seed))
    const { signX, signY, isXYSwapped } = state.grid
    const isImg = baseNoise.id === 'image' && Boolean(imgData)

    const { cellSize, cellsNumW, cellsNumH, normalW, normalH } = getGridCellSizes(
        state.cell.size,
        state.canvasSize,
    )

    // Add bounding points if variance isn't 0. If variance == 0 it means
    // the grid's cells are square and adding bounding points is not only
    // unnecessary but also adds distortion
    const points = state.cell.variance
        ? // prettier-ignore
          [
              0, 0,
              width, 0,
              width, height,
              0, height,
          ]
        : []

    // add the rest of the points
    for (let i = 0; i <= cellsNumW; i += 1) {
        for (let j = 0; j <= cellsNumH; j += 1) {
            const rndW = random.rnd(state.cell.variance)
            const rndH = random.rnd(state.cell.variance)
            const x = (i + rndW) * cellSize
            const y = (j + rndH) * cellSize
            if (x < width + cellSize && y < height + cellSize && x > -cellSize && y > -cellSize) {
                points.push(x, y)
            }
        }
    }

    const delaunay = new Delaunay(points)
    const palette = state.colors.palette.colors
    const noiseFn = getNoiseFn(noises, baseNoise)

    if (!palette.length || !noiseFn)
        return { vertices: new Float32Array(), fillColors: new Float32Array(), type }

    const getColor = getColorPickerFn(palette, state.colors.isGradient)

    const getRandomNoiseVal = () => (noise2Strength ? random.rnd(noise2Strength) : 0)

    const getNoiseVal = (cx: number, cy: number) => {
        const x = (cx / cellSize - cellsNumW / 2 + state.noise.offsetX) / (zoom * 2)
        const y = (cy / cellSize - cellsNumH / 2 + state.noise.offsetY) / (zoom * 2)
        const xx = isXYSwapped ? signY * y : signX * x
        const yy = isXYSwapped ? signX * x : signY * y
        const noiseValue = noiseFn(xx, yy, normalW, normalH) + getRandomNoiseVal()
        return clamp(noiseValue, -1, 1)
    }

    // generate triangles
    if (type === 'triangles') {
        const len = delaunay.triangles.length / 3
        const vertices = new Float32Array(len * 6)
        const fillColors = new Float32Array(len * 4)
        for (let i = 0; i < len; i += 1) {
            const { points, triangles } = delaunay
            const t0 = triangles[i * 3 + 0]
            const t1 = triangles[i * 3 + 1]
            const t2 = triangles[i * 3 + 2]
            const v1 = [points[t0 * 2], points[t0 * 2 + 1]]
            const v2 = [points[t1 * 2], points[t1 * 2 + 1]]
            const v3 = [points[t2 * 2], points[t2 * 2 + 1]]
            const cx = (v1[0] + v2[0] + v3[0]) / 3
            const cy = (v1[1] + v2[1] + v3[1]) / 3

            if (isImg) {
                const col = clamp(Math.floor(cx / cellSize), 0, cellsNumW)
                const row = clamp(Math.floor(cy / cellSize), 0, cellsNumH)

                setFillColorFromImg(
                    row * cellsNumW + col,
                    imgData as Uint8ClampedArray,
                    fillColors,
                    i,
                    getRandomNoiseVal(),
                    state.noise,
                )
            } else {
                setFillColor(getNoiseVal(cx, cy), state.noise, getColor, fillColors, i)
            }

            vertices.set(v1, i * 6)
            vertices.set(v2, i * 6 + 2)
            vertices.set(v3, i * 6 + 4)
        }
        return { vertices, fillColors, type }
    }

    // generate Voronoi
    const voronoi = delaunay.voronoi([0, 0, width + cellSize, height + cellSize])
    const vertices: Array<number> = []
    const fillColors: Array<number> = []
    let count = 0
    for (const vertCoords of voronoi.cellPolygons()) {
        vertices.push(vertCoords.length * 2)
        const sum = [0, 0]
        for (let i = 0; i < vertCoords.length; i += 1) {
            sum[0] += vertCoords[i][0]
            sum[1] += vertCoords[i][1]
            vertices.push(vertCoords[i][0], vertCoords[i][1])
        }
        const cx = sum[0] / vertCoords.length
        const cy = sum[1] / vertCoords.length

        if (isImg) {
            const col = clamp(Math.floor(cx / cellSize), 0, cellsNumW)
            const row = clamp(Math.floor(cy / cellSize), 0, cellsNumH)

            setFillColorFromImg(
                row * cellsNumW + col,
                imgData as Uint8ClampedArray,
                fillColors,
                count++,
                getRandomNoiseVal(),
                state.noise,
            )
        } else {
            setFillColor(getNoiseVal(cx, cy), state.noise, getColor, fillColors, count++)
        }
    }
    return { vertices: new Float32Array(vertices), fillColors: new Float32Array(fillColors), type }
}
