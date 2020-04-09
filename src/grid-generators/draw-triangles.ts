interface DrawTrianglesProperties {
    fillColors: Float32Array | number[]
    vertices: Float32Array | number[]
    ctx: CanvasRenderingContext2D
    borderWidth: number
    borderColor: string
}

export default function drawTriangles({
    fillColors,
    vertices,
    ctx,
    borderWidth,
    borderColor,
}: DrawTrianglesProperties) {
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

            ctx.moveTo(v[vertIdx], v[vertIdx + 1])
            ctx.lineTo(v[vertIdx + 2], v[vertIdx + 3])
            ctx.lineTo(v[vertIdx + 4], v[vertIdx + 5])

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
        vertIdx += 6
        colIdx += 4
    }
}
