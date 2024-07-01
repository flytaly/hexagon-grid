import { GridType } from '../state/canvas-state-types'

 
export type PolygonData = {
    vertices: Float32Array | number[]
    fillColors: Float32Array | number[]
    type: GridType
}

export const vertsPerPolygon = {
    triangles: 3,
    hexagons: 6,
    voronoi: 0, // 'variable'
}

interface DrawPolygonsProperties {
    borderColor: string
    borderWidth: number
    closePath: boolean // triangles with closed path don't look good because their tips could intersect
    ctx: CanvasRenderingContext2D
    polygonData: PolygonData
    useBodyColor?: boolean
    fillBody?: boolean
}

export default function drawPolygons({
    borderColor,
    borderWidth,
    ctx,
    polygonData,
    closePath = false,
    fillBody = true,
    useBodyColor = false,
}: DrawPolygonsProperties): void {
    const { fillColors, vertices, type } = polygonData
    const verticesNum = vertsPerPolygon[type]
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

            if (fillBody) {
                ctx.fill()
            }
            ctx.lineWidth = Math.max(1, borderWidth)

            closePath && ctx.closePath()
            ctx.strokeStyle = useBodyColor || !borderWidth ? fillColor : borderColor
            ctx.stroke()
        }

        vertIdx += coordsNum
        colIdx += 4
    }
}
