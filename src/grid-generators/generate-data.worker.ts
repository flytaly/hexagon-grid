/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
import { Delaunay } from 'd3-delaunay'
import chroma from 'chroma-js'
import * as Honeycomb from 'honeycomb-grid'
import { Parser } from 'expr-eval'
import { RGBColor } from 'react-color'
import { PolygonData } from './draw-polygons'
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

/** n - number ∈ [0,1] */
type GetColorFromRange = (n: number) => RGBColor

function getNoiseFn(noises: Noises2DFns, baseNoise: BaseNoise) {
    let noiseFn: NoiseFn | undefined

    if (baseNoise.id === 'custom') {
        try {
            const expr = Parser.parse(baseNoise.customFn || '')
            // testing evaluation to throw an error if an expression is incorrect
            expr.evaluate({ x: 1, y: 1, w: 1, h: 1 })
            noiseFn = (x, y, w = 1, h = 1) => expr.evaluate({ x, y, w, h })
        } catch (e) {
            console.warn(e)
        }
    } else if (baseNoise.id === 'image') {
        noiseFn = () => 0
    } else {
        noiseFn = noises[baseNoise.id]
    }

    return noiseFn
}

function getColorPickerFn(palette: PaletteColorsArray, isGradient = true): GetColorFromRange {
    if (!isGradient) {
        return (n: number) => {
            const colorId = clamp(Math.floor(n * 0.999999 * palette.length), 0, palette.length - 1)
            return palette[colorId].rgb
        }
    }

    const fn = chroma
        .scale(palette.map(({ rgb }) => chroma.rgb(rgb.r, rgb.g, rgb.b).alpha(rgb.a || 0)))
        .mode('lrgb')

    return (n: number) => {
        const color = fn(n)
        const [r, g, b, a] = color.rgba()
        return { r, g, b, a }
    }
}

function setFillColor(
    noiseValue: number,
    noise: NoiseSettings,
    getColor: GetColorFromRange,
    fillColors: Float32Array | Array<number>,
    index: number,
) {
    const { hue: H, saturation: S, lightness: L } = noise

    const colorId = clamp((noiseValue + 1) / 2, 0, 1)
    const color = getColor(colorId)

    const [h, s, l] = rgbToHsl(color.r, color.g, color.b)

    fillColors[index * 4] = Math.round(h + H * noiseValue) // hue
    fillColors[index * 4 + 1] = Math.round(s + S * noiseValue) // saturation
    fillColors[index * 4 + 2] = Math.round(l + L * noiseValue) // light
    fillColors[index * 4 + 3] = color.a || 0 // alpha
}

function setFillColorFromImg(
    offset: number,
    imgData: Uint8ClampedArray,
    fillColors: Float32Array | Array<number>,
    index: number,
    noiseValue: number,
    noise: NoiseSettings,
) {
    const { hue: H, saturation: S, lightness: L } = noise
    const $offset = offset * 4
    const [h, s, l] = rgbToHsl(imgData[$offset], imgData[$offset + 1], imgData[$offset + 2])
    fillColors[index * 4] = Math.round(h + H * noiseValue) // hue
    fillColors[index * 4 + 1] = Math.round(s + S * noiseValue) // saturation
    fillColors[index * 4 + 2] = Math.round(l + L * noiseValue) // light
    fillColors[index * 4 + 3] = imgData[$offset + 3]
}

function genHexData(state: CanvasState, imgData?: Uint8ClampedArray | null): PolygonData {
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
    const result: PolygonData = { vertices, fillColors, type: 'hexagons' }

    const noiseFn = getNoiseFn(noises, baseNoise)
    if (!palette.length || !noiseFn) return result

    const getColor = getColorPickerFn(palette, state.colors.isGradient)

    const getRandomNoiseVal = () => (noise2Strength ? random.rnd(noise2Strength) : 0)
    const getNoiseVal = (cx: number, cy: number) =>
        clamp(
            noiseFn(signX * cx, signY * cy, sizes.normalW, sizes.normalH) + getRandomNoiseVal(),
            -1,
            1,
        )

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

function genDelaunayData(
    state: CanvasState,
    type = 'triangles' as GridType,
    imgData?: Uint8ClampedArray | null,
): PolygonData {
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

    const getColor = getColorPickerFn(palette, state.colors.isGradient)

    const getRandomNoiseVal = () => (noise2Strength ? random.rnd(noise2Strength) : 0)

    const getNoiseVal = (cx: number, cy: number) => {
        const x = (cx / cellSize - cellsNumW / 2 + state.noise.offsetX) / (zoom * 2)
        const y = (cy / cellSize - cellsNumH / 2 + state.noise.offsetY) / (zoom * 2)
        const noiseValue = noiseFn(signX * x, signY * y, normalW, normalH) + getRandomNoiseVal()
        return clamp(noiseValue, -1, 1)
    }

    // generate triangles
    if (type === 'triangles') {
        const len = delaunay.triangles.length / 3
        const vertices = new Float32Array(len * 6)
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
                    getRandomNoiseVal(),
                    state.noise,
                )
            } else {
                setFillColor(getNoiseVal(cx, cy), state.noise, getColor, fillColors, i)
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
                getRandomNoiseVal(),
                state.noise,
            )
        } else {
            setFillColor(getNoiseVal(cx, cy), state.noise, getColor, fillColors, count++)
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
