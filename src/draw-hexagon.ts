import { Hex } from 'honeycomb-grid'
import { CanvasState } from './canvas-state'
import { toHslStr } from './helpers'

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
    if (state.hex.borderWidth) {
        ctx.strokeStyle = toHslStr(state.colors.hexBorder)
        ctx.lineWidth = state.hex.borderWidth
        ctx.stroke()
    }
    ctx.fillStyle =
        noiseValue > 0
            ? `hsl(${37 + H * noiseValue},${90 + S * noiseValue}%, ${50 + L * noiseValue}%)`
            : `hsl(${214 + H * noiseValue},${70 + S * noiseValue}%, ${40 + L * noiseValue}%)`

    // hsl(37, 94%, 53%)
    // hsl(214, 69%, 39%)
    // ctx.fillStyle = `hsl(${30},50%,${value2d > 0 ? 100 : 0}%)`
    ctx.fill()
}
