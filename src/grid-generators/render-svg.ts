import { SVG, Svg } from '@svgdotjs/svg.js'
import { CanvasState } from '../state/canvas-state-types'
import { toRGBAStr } from '../helpers'
import { PolygonData, vertsPerPolygon } from './draw-polygons'

interface DrawPolygonsProperties {
    state: CanvasState
    polygonData: PolygonData
}

export default function renderSVg({ state, polygonData }: DrawPolygonsProperties): Svg {
    const { fillColors, vertices, type } = polygonData
    const verticesNum = vertsPerPolygon[type]
    const { width, height } = state.canvasSize
    const { borderWidth } = state.cell
    const borderColor = toRGBAStr(state.colors.border)
    const fillBody = !state.colors.noFill
    const useBodyColor = Boolean(state.colors.useBodyColor)

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

            draw.polygon(poly.join(' '))
                .fill(fillBody ? fillColor : 'none')
                .stroke({
                    color: useBodyColor || !borderWidth ? fillColor : borderColor,
                    width: Math.max(1, borderWidth),
                })

            vertIdx += coordsNum
            colIdx += 4
        }
    }

    return draw
}
