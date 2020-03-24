/* eslint-disable no-restricted-globals */
import * as Honeycomb from 'honeycomb-grid'
import { CanvasState } from './canvas-state'
import { clamp } from './helpers'
import { getNoises } from './noises'

// just to suppress ts errors
interface HexWithCorrectSetDeclaration extends Omit<Honeycomb.BaseHex<{}>, 'set'> {
    set(hex: { q: number; r: number; s: number }): Honeycomb.Hex<{}>
}

function genHexes(state: CanvasState) {
    const { width, height, aspect } = state.canvasSize
    const { orientation } = state.hex
    const { zoom, baseNoise, noise2Strength } = state.noise
    const [noises, random] = getNoises(String(state.noise.seed))

    const hexSize =
        aspect < 1
            ? (state.hex.size * height * aspect) / 100
            : (state.hex.size * width) / aspect / 100

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

    grid.forEach((hexagon, idx) => {
        const [xx, yy] = [
            (hexagon.x - widthCount / 2 + state.noise.offsetX + 1) / zoom,
            (hexagon.y - heightCount / 2 + state.noise.offsetY + 1) / zoom,
        ]
        let noiseValue = noises[baseNoise](signX * xx, signY * yy, normalW, normalH)

        if (noise2Strength) {
            noiseValue += random.rnd(noise2Strength)
        }
        const point = hexagon.nudge().toPoint()
        hexagon.corners().forEach((corner, cornerIdx) => {
            const { x, y } = corner.add(point)
            vertices[idx * 12 + cornerIdx * 2] = x
            vertices[idx * 12 + cornerIdx * 2 + 1] = y
        })

        const { hue: H, saturation: S, lightness: L } = state.noise
        const palette = state.colors.palette.colors
        const colorId = Math.floor(clamp((noiseValue + 1) / 2, 0, 0.999999) * palette.length)
        const { h, s, l, a } = palette[colorId]

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
    const hexDrawData = genHexes(state)
    self.postMessage(hexDrawData)
})

export default {} as typeof Worker & (new () => Worker)
