import { SVG } from '@svgdotjs/svg.js'
import { CanvasState } from '../canvas-state-types'
import { toRGBAStr } from '../helpers'
import { PolygonData, vertsPerPolygon } from './draw-polygons'

interface DrawPolygonsProperties {
    state: CanvasState
    polygonData: PolygonData
}

export default function renderSVg({ state, polygonData }: DrawPolygonsProperties) {
    const { fillColors, vertices, type } = polygonData
    const verticesNum = vertsPerPolygon[type]
    const { width, height } = state.canvasSize
    const { borderWidth } = state.cell
    const borderColor = toRGBAStr(state.colors.border)
    const onlyBorder = !!state.colors.noFill

    const draw = SVG().size(width, height)

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

            const poly = [] as [number, number][]
            for (let i = 0; i < coordsNum; i += 2) {
                poly.push([Math.round(v[vertIdx + i]), Math.round(v[vertIdx + i + 1])])
            }

            if (onlyBorder) {
                draw.polygon(poly.join(' '))
                    .fill('none')
                    .stroke({
                        color: fillColor,
                        width: Math.max(1, borderWidth),
                    })
            } else {
                draw.polygon(poly.join(' ')).fill(fillColor).stroke({
                    color: borderColor,
                    width: borderWidth,
                })
            }

            vertIdx += coordsNum
            colIdx += 4
        }
    }

    return draw
}
