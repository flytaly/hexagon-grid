interface DrawHexagonProperties {
    fillColors: Float32Array | number[]
    vertices: Float32Array | number[]
    ctx: CanvasRenderingContext2D
    borderWidth: number
    borderColor: string
}

export default function drawHexagons({
    fillColors,
    vertices,
    ctx,
    borderWidth,
    borderColor,
}: DrawHexagonProperties) {
    const c = fillColors
    const v = vertices
    let vertIdx = 0
    let colIdx = 0
    while (vertIdx < v.length) {
        // discard transparent hexagons
        if (c[colIdx + 3] !== 0) {
            const fillColor = `hsla(${c[colIdx]}, ${c[colIdx + 1]}%, ${c[colIdx + 2]}%, ${
                c[colIdx + 3]
            })`
            ctx.fillStyle = fillColor

            ctx.beginPath()

            ctx.moveTo(v[vertIdx + 10], v[vertIdx + 11]) // last vertex
            for (let i = 0; i < 12; i += 2) {
                ctx.lineTo(v[vertIdx + i], v[vertIdx + i + 1])
            }
            ctx.lineTo(v[vertIdx], v[vertIdx + 1]) // first vertex

            ctx.fill()
            if (borderWidth) {
                ctx.strokeStyle = borderColor
                ctx.lineWidth = borderWidth
            } else {
                ctx.strokeStyle = fillColor
                ctx.lineWidth = 1
            }
            ctx.stroke()
            ctx.closePath()
        }
        vertIdx += 12
        colIdx += 4
    }
}
