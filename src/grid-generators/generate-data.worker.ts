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
import { clamp } from '../helpers'
import { getNoises, NoiseFn, Noises2DFns } from '../noises'

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

    if (baseNoise.id !== 'custom') {
        noiseFn = noises[baseNoise.id]
    } else if (baseNoise.customFn) {
        try {
            const expr = Parser.parse(baseNoise.customFn)
            // testing evaluation to throw an error if an expression is incorrect
            expr.evaluate({ x: 1, y: 1, w: 1, h: 1 })
            noiseFn = (x, y, w = 1, h = 1) => expr.evaluate({ x, y, w, h })
        } catch (e) {
            // console.log(e)
        }
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

function genHexData(state: CanvasState): CanvasData {
    const { width, height, aspect } = state.canvasSize
    const { orientation } = state.cell
    const { zoom, baseNoise, noise2Strength } = state.noise

    const [noises, random] = getNoises(String(state.noise.seed))

    const hexSize =
        aspect < 1
            ? (state.cell.size * height * aspect) / 100
            : (state.cell.size * width) / aspect / 100

    const Hex = Honeycomb.extendHex({ size: hexSize, orientation })

    const widthStep = orientation === 'pointy' ? hexSize * Math.sqrt(3) : hexSize * 1.5
    const heightStep = orientation === 'pointy' ? hexSize * 1.5 : hexSize * Math.sqrt(3)
    const widthCount = width / widthStep + 1
    const heightCount = height / heightStep + 1

    const Grid = Honeycomb.defineGrid(Hex)

    const { sparse, signX, signY } = state.grid

    const [rectW, rectH] = [widthCount / sparse, heightCount / sparse]
    const [normalW, normalH] = [
        aspect < 1 ? rectW / 10 : rectW / 10 / aspect,
        aspect < 1 ? (rectH * aspect) / 10 : rectH / 10,
    ]

    const onCreate = (hex: HexWithCorrectSetDeclaration) => {
        hex.set({ q: hex.q * sparse, r: hex.r * sparse, s: hex.s * sparse })
    }

    const grid = Grid.rectangle({
        width: rectW,
        height: rectH,
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
            (hexagon.x - widthCount / 2 + state.noise.offsetX + 1) / zoom,
            (hexagon.y - heightCount / 2 + state.noise.offsetY + 1) / zoom,
        ]

        let noiseValue = noiseFn(signX * xx, signY * yy, normalW, normalH)
        if (noise2Strength) {
            noiseValue += random.rnd(noise2Strength)
        }
        setFillColor(noiseValue, state.noise, palette, fillColors, idx)

        const point = hexagon.toPoint()
        hexagon.corners().forEach((corner, cornerIdx) => {
            const { x, y } = corner.add(point)
            vertices[idx * 12 + cornerIdx * 2] = x
            vertices[idx * 12 + cornerIdx * 2 + 1] = y
        })
    })

    return result
}

function genDelaunayData(state: CanvasState, type = 'triangles' as GridType): CanvasData {
    const { width, height, aspect } = state.canvasSize
    const { zoom, baseNoise, noise2Strength } = state.noise
    const [noises, random] = getNoises(String(state.noise.seed))
    const { signX, signY } = state.grid

    const cellsNumW = Math.round((100 * aspect) / state.cell.size)
    const cellsNumH = Math.round(100 / state.cell.size)
    const cellSquareSize = width / aspect / cellsNumH / 2
    const cellW = width / cellsNumW
    const cellH = height / cellsNumH
    const [normalW, normalH] = [
        aspect < 1 ? cellsNumW / 10 : cellsNumW / 10 / aspect,
        aspect < 1 ? (cellsNumH * aspect) / 10 : cellsNumH / 10,
    ]

    // add bounding points
    const points = [
        [0, 0],
        [width, 0],
        [width, height],
        [0, height],
    ]

    // add rest points
    for (let i = 0; i <= cellsNumW; i += 1) {
        for (let j = 0; j <= cellsNumH; j += 1) {
            const rndW = random.rnd(state.cell.variance)
            const rndH = random.rnd(state.cell.variance)
            const x = (i + rndW) * cellW
            const y = (j + rndH) * cellH
            if (x < width + cellW && y < height + cellH) {
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
        const x = (cx / cellSquareSize - cellsNumW + state.noise.offsetX) / (zoom * 2)
        const y = (cy / cellSquareSize - cellsNumH + state.noise.offsetY) / (zoom * 2)
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
            setFillColor(getNoiseVal(cx, cy), state.noise, palette, fillColors, i)
            ;[vertices[i * 6], vertices[i * 6 + 1]] = v1
            ;[vertices[i * 6 + 2], vertices[i * 6 + 3]] = v2
            ;[vertices[i * 6 + 4], vertices[i * 6 + 5]] = v3
        }
        return { vertices, fillColors, type }
    }

    // generate Voronoi
    const voronoi = delaunay.voronoi([0, 0, width, height])
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
        setFillColor(getNoiseVal(cx, cy), state.noise, palette, fillColors, count++)
    }
    return { vertices: new Float32Array(vertices), fillColors: new Float32Array(fillColors), type }
}

self.addEventListener('message', (event) => {
    const { state } = event.data as { state: CanvasState }

    let hexDrawData: CanvasData

    switch (state.grid.type) {
        case 'triangles':
            hexDrawData = genDelaunayData(state, 'triangles')
            break
        case 'voronoi':
            hexDrawData = genDelaunayData(state, 'voronoi')
            break
        case 'hexagons':
        default:
            hexDrawData = genHexData(state)
    }

    self.postMessage(hexDrawData)
})

export default {} as typeof Worker & (new () => Worker)
