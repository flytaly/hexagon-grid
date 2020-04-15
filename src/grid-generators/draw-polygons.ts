/* eslint-disable @typescript-eslint/no-unused-expressions */

interface DrawPolygonsProperties {
    borderColor: string
    borderWidth: number
    closePath: boolean // triangles with closed path don't look good because their tips could intersect
    ctx: CanvasRenderingContext2D
    fillColors: Float32Array | number[]
    vertices: Float32Array | number[]
    verticesNum: number // vertices per polygon (0 = variable)
}

export default function drawPolygons({
    borderColor,
    borderWidth,
    closePath = false,
    ctx,
    fillColors,
    vertices,
    verticesNum,
}: DrawPolygonsProperties) {
    const c = fillColors
    const v = vertices
    let vertIdx = 0
    let colIdx = 0
    const coordsPerPoly = verticesNum * 2
    while (vertIdx < v.length) {
        const coordsNum = coordsPerPoly || v[vertIdx++] // if 0 then use first number as indicator of vertices number

        // discard transparent polygons
        if (c[colIdx + 3] !== 0) {
            const fillColor = `hsla(${c[colIdx]}, ${c[colIdx + 1]}%, ${c[colIdx + 2]}%, ${
                c[colIdx + 3]
            })`
            ctx.fillStyle = fillColor

            ctx.beginPath()
            ctx.moveTo(v[vertIdx + coordsNum - 2], v[vertIdx + coordsNum - 1]) // last vertex
            for (let i = 0; i < coordsNum; i += 2) {
                ctx.lineTo(v[vertIdx + i], v[vertIdx + i + 1])
            }

            ctx.fill()

            closePath && ctx.closePath()
            if (borderWidth) {
                ctx.strokeStyle = borderColor
                ctx.lineWidth = borderWidth
            } else {
                ctx.strokeStyle = fillColor
                ctx.lineWidth = 1
            }
            ctx.stroke()
        }

        vertIdx += coordsNum
        colIdx += 4
    }
}
