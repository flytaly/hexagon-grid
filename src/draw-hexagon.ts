import { Hex } from 'honeycomb-grid'
import { CanvasState } from './canvas-state'
import { toHslaStr, clamp } from './helpers'

interface DrawHexagonProperties {
    hexagon: Hex<{}>
    noiseValue: number
    ctx: CanvasRenderingContext2D
    state: CanvasState
}

export default function drawHexagon({ hexagon, noiseValue, ctx, state }: DrawHexagonProperties) {
    const point = hexagon.nudge().toPoint()

    const corners = hexagon.corners().map((corner) => corner.add(point))
    const [firstCorner, ...otherCorners] = corners

    const { hue: H, saturation: S, lightness: L } = state.noise

    ctx.beginPath()
    ctx.moveTo(firstCorner.x, firstCorner.y)
    otherCorners.forEach((c) => ctx.lineTo(c.x, c.y))
    ctx.lineTo(firstCorner.x, firstCorner.y)

    const palette = state.colors.palette.colors
    const colorId = Math.floor(clamp((noiseValue + 1) / 2, 0, 0.999999) * palette.length)
    const { h, s, l, a } = palette[colorId]

    if (a === 0) return

    // noiseValue = Math.sign(noiseValue) - noiseValue

    const hue = h + H * noiseValue
    const saturation = s * 100 + S * noiseValue
    // const light = Math.abs((l * 100 + L * noiseValue) % 100)
    const light = l * 100 + L * noiseValue

    const fillColor = `hsla(${hue},${saturation}%, ${light}%, ${a})`
    ctx.fillStyle = fillColor
    ctx.fill()

    if (state.hex.borderWidth) {
        ctx.strokeStyle = toHslaStr(state.colors.hexBorder)
        ctx.lineWidth = state.hex.borderWidth
        ctx.closePath()
        ctx.stroke()
    } else {
        ctx.strokeStyle = fillColor
        ctx.lineWidth = 1
    }
    ctx.closePath()
    ctx.stroke()
}
