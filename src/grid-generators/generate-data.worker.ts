/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
import { Delaunay } from 'd3-delaunay'

import * as Honeycomb from 'honeycomb-grid'
import { Parser } from 'expr-eval'
import {
    CanvasState,
    GridType,
    BaseNoise,
    NoiseSettings,
    PaletteColorsArray,
} from '../canvas-state-types'
import { clamp, rgbToHsl } from '../helpers'
import { getNoises, NoiseFn, Noises2DFns } from '../noises'
import { getGridCellSizes, getHexCellSize } from './get-sizes'

// just to suppress ts errors
interface HexWithCorrectSetDeclaration extends Omit<Honeycomb.BaseHex<{}>, 'set'> {
    set(hex: { q: number; r: number; s: number }): Honeycomb.Hex<{}>
}

type CanvasData = {
    vertices: Float32Array | number[]
    fillColors: Float32Array | number[]
    type: GridType
}

function getNoiseFn(noises: Noises2DFns, baseNoise: BaseNoise) {
    let noiseFn: NoiseFn | undefined

    if (baseNoise.id === 'custom') {
        try {
            const expr = Parser.parse(baseNoise.customFn || '')
            // testing evaluation to throw an error if an expression is incorrect
            expr.evaluate({ x: 1, y: 1, w: 1, h: 1 })
            noiseFn = (x, y, w = 1, h = 1) => expr.evaluate({ x, y, w, h })
        } catch (e) {
            // console.log(e)
        }
    } else if (baseNoise.id === 'image') {
        noiseFn = () => 0
    } else {
        noiseFn = noises[baseNoise.id]
    }

    return noiseFn
}

function setFillColor(
    noiseValue: number,
    noise: NoiseSettings,
    palette: PaletteColorsArray,
    fillColors: Float32Array | Array<number>,
    index: number,
) {
    const { hue: H, saturation: S, lightness: L } = noise

    const colorId = Math.floor(clamp((noiseValue + 1) / 2, 0, 0.999999) * palette.length)
    const { h, s, l, a } = palette[colorId].hsl

    fillColors[index * 4] = h + H * noiseValue // hue
    fillColors[index * 4 + 1] = s * 100 + S * noiseValue // saturation
    fillColors[index * 4 + 2] = l * 100 + L * noiseValue // light
    fillColors[index * 4 + 3] = a || 0 // alpha
}

function setFillColorFromImg(
    offset: number,
    imgData: Uint8ClampedArray,
    fillColors: Float32Array | Array<number>,
    index: number,
) {
    const $offset = offset * 4
    const [h, s, l] = rgbToHsl(imgData[$offset], imgData[$offset + 1], imgData[$offset + 2])
    fillColors[index * 4] = h
    fillColors[index * 4 + 1] = s
    fillColors[index * 4 + 2] = l
    fillColors[index * 4 + 3] = imgData[$offset + 3]
}

function genHexData(state: CanvasState, imgData?: Uint8ClampedArray | null): CanvasData {
    const { orientation } = state.cell
    const { zoom, baseNoise, noise2Strength } = state.noise
    const { sparse, signX, signY } = state.grid
    const isImg = baseNoise.id === 'image' && Boolean(imgData)

    const [noises, random] = getNoises(String(state.noise.seed))
    const sizes = getHexCellSize(state.cell, state.canvasSize, state.grid)

    const Hex = Honeycomb.extendHex({ size: sizes.hexSize, orientation })
    const Grid = Honeycomb.defineGrid(Hex)

    const onCreate = (hex: HexWithCorrectSetDeclaration) => {
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
    const result: CanvasData = { vertices, fillColors, type: 'hexagons' }

    const noiseFn = getNoiseFn(noises, baseNoise)
    if (!palette.length || !noiseFn) return result

    grid.forEach((hexagon, idx) => {
        const [xx, yy] = [
            (hexagon.x - (sparse * sizes.cellsNumW) / 2 + state.noise.offsetX + 1) / zoom,
            (hexagon.y - (sparse * sizes.cellsNumH) / 2 + state.noise.offsetY + 1) / zoom,
        ]

        let noiseValue = noiseFn(signX * xx, signY * yy, sizes.normalW, sizes.normalH)
        if (noise2Strength) {
            noiseValue += random.rnd(noise2Strength)
        }

        if (isImg) {
            const col = clamp(Math.ceil(hexagon.x), 0, sizes.cellsNumW)
            const row = clamp(Math.ceil(hexagon.y), 0, sizes.cellsNumH)

            setFillColorFromImg(
                row * sizes.cellsNumW + col,
                imgData as Uint8ClampedArray,
                fillColors,
                idx,
            )
        } else {
            setFillColor(noiseValue, state.noise, palette, fillColors, idx)
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

function genDelaunayData(
    state: CanvasState,
    type = 'triangles' as GridType,
    imgData?: Uint8ClampedArray | null,
): CanvasData {
    const { width, height } = state.canvasSize
    const { zoom, baseNoise, noise2Strength } = state.noise
    const [noises, random] = getNoises(String(state.noise.seed))
    const { signX, signY } = state.grid
    const isImg = baseNoise.id === 'image' && Boolean(imgData)

    const { cellSize, cellsNumW, cellsNumH, normalW, normalH } = getGridCellSizes(
        state.cell.size,
        state.canvasSize,
    )

    // Add bounding points if variance isn't 0. If variance == 0 it means
    // the grid's cells are square and adding bounding points is not only
    // unnecessary but also adds distortion
    const points = state.cell.variance
        ? [
              [0, 0],
              [width, 0],
              [width, height],
              [0, height],
          ]
        : []

    // add rest points
    for (let i = 0; i <= cellsNumW; i += 1) {
        for (let j = 0; j <= cellsNumH; j += 1) {
            const rndW = random.rnd(state.cell.variance)
            const rndH = random.rnd(state.cell.variance)
            const x = (i + rndW) * cellSize
            const y = (j + rndH) * cellSize
            if (x < width + cellSize && y < height + cellSize && x > -cellSize && y > -cellSize) {
                points.push([x, y])
            }
        }
    }

    const delaunay = Delaunay.from(points)
    const palette = state.colors.palette.colors
    const noiseFn = getNoiseFn(noises, baseNoise)

    if (!palette.length || !noiseFn)
        return { vertices: new Float32Array(), fillColors: new Float32Array(), type }

    const getNoiseVal = (cx: number, cy: number) => {
        const x = (cx / cellSize - cellsNumW / 2 + state.noise.offsetX) / (zoom * 2)
        const y = (cy / cellSize - cellsNumH / 2 + state.noise.offsetY) / (zoom * 2)
        let noiseValue = noiseFn(signX * x, signY * y, normalW, normalH)
        if (noise2Strength) {
            noiseValue += random.rnd(noise2Strength)
        }
        return noiseValue
    }

    // generate triangles
    if (type === 'triangles') {
        const len = delaunay.triangles.length / 3
        const vertices = new Float32Array(delaunay.triangles.length * 6)
        const fillColors = new Float32Array(len * 4)
        for (let i = 0; i < len; i += 1) {
            const v1 = [
                points[delaunay.triangles[i * 3]][0], //
                points[delaunay.triangles[i * 3]][1],
            ]
            const v2 = [
                points[delaunay.triangles[i * 3 + 1]][0],
                points[delaunay.triangles[i * 3 + 1]][1],
            ]
            const v3 = [
                points[delaunay.triangles[i * 3 + 2]][0],
                points[delaunay.triangles[i * 3 + 2]][1],
            ]
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
                )
            } else {
                setFillColor(getNoiseVal(cx, cy), state.noise, palette, fillColors, i)
            }

            ;[vertices[i * 6], vertices[i * 6 + 1]] = v1
            ;[vertices[i * 6 + 2], vertices[i * 6 + 3]] = v2
            ;[vertices[i * 6 + 4], vertices[i * 6 + 5]] = v3
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
            )
        } else {
            setFillColor(getNoiseVal(cx, cy), state.noise, palette, fillColors, count++)
        }
    }
    return { vertices: new Float32Array(vertices), fillColors: new Float32Array(fillColors), type }
}

self.addEventListener('message', (event) => {
    const { state, imgData } = event.data as {
        state: CanvasState
        imgData: Uint8ClampedArray | null
    }

    const hexDrawData =
        state.grid.type === 'hexagons'
            ? genHexData(state, imgData)
            : genDelaunayData(state, state.grid.type, imgData)

    self.postMessage(hexDrawData)
})

export default {} as typeof Worker & (new () => Worker)
