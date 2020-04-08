/* eslint-disable no-restricted-globals */
import * as Honeycomb from 'honeycomb-grid'
import { Parser } from 'expr-eval'
import { CanvasState, GridType } from '../canvas-state-types'
import { clamp } from '../helpers'
import { getNoises, NoiseFn } from '../noises'

// just to suppress ts errors
interface HexWithCorrectSetDeclaration extends Omit<Honeycomb.BaseHex<{}>, 'set'> {
    set(hex: { q: number; r: number; s: number }): Honeycomb.Hex<{}>
}

type CanvasData = {
    vertices: Float32Array | number[]
    fillColors: Float32Array | number[]
    type: GridType
}

function genHexes(state: CanvasState) {
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

    const vertices = new Float32Array(grid.length * 6 * 2)
    const fillColors = new Float32Array(grid.length * 4)

    let noiseFn: NoiseFn | undefined

    if (baseNoise.id !== 'custom') {
        noiseFn = noises[baseNoise.id]
    } else if (baseNoise.customFn) {
        try {
            const expr = Parser.parse(baseNoise.customFn)
            noiseFn = (x, y, w = 1, h = 1) => expr.evaluate({ x, y, w, h })
        } catch (e) {
            //
        }
    }

    if (!noiseFn) return { vertices, fillColors }

    grid.forEach((hexagon, idx) => {
        const [xx, yy] = [
            (hexagon.x - widthCount / 2 + state.noise.offsetX + 1) / zoom,
            (hexagon.y - heightCount / 2 + state.noise.offsetY + 1) / zoom,
        ]
        let noiseValue = noiseFn ? noiseFn(signX * xx, signY * yy, normalW, normalH) : 0

        if (noise2Strength) {
            noiseValue += random.rnd(noise2Strength)
        }
        const point = hexagon.toPoint()
        hexagon.corners().forEach((corner, cornerIdx) => {
            const { x, y } = corner.add(point)
            vertices[idx * 12 + cornerIdx * 2] = x
            vertices[idx * 12 + cornerIdx * 2 + 1] = y
        })

        const { hue: H, saturation: S, lightness: L } = state.noise
        const palette = state.colors.palette.colors
        if (!palette.length) return
        const colorId = Math.floor(clamp((noiseValue + 1) / 2, 0, 0.999999) * palette.length)
        const { h, s, l, a } = palette[colorId].hsl

        // const light = Math.abs((l * 100 + L * noiseValue) % 100)
        fillColors[idx * 4] = h + H * noiseValue // hue
        fillColors[idx * 4 + 1] = s * 100 + S * noiseValue // saturation
        fillColors[idx * 4 + 2] = l * 100 + L * noiseValue // light
        fillColors[idx * 4 + 3] = a || 0 // alpha
    })

    return { vertices, fillColors }
}

self.addEventListener('message', (event) => {
    const { state } = event.data

    let hexDrawData: CanvasData

    switch (state.grid.type) {
        case 'triangles':
            // TODO: generate triangles data
            hexDrawData = { vertices: [], fillColors: [], type: 'triangles' }
            break
        case 'hexagons':
        default:
            hexDrawData = { ...genHexes(state), type: 'hexagons' }
    }

    self.postMessage(hexDrawData)
})

export default {} as typeof Worker & (new () => Worker)
