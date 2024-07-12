import { SVG, Svg } from '@svgdotjs/svg.js'

import { hslToRgb, toRGBAStr, toRGBHex } from '#/helpers'
import { CanvasState } from '#/state/canvas-state-types'
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
    const rgbaBorder = state.colors.border
    if (rgbaBorder.a === undefined) rgbaBorder.a = 1
    const fillBody = !state.colors.noFill
    const useBodyColor = Boolean(state.colors.useBodyColor || !borderWidth)
    const draw = SVG().size(width, height).viewbox(0, 0, width, height)
    if (state.colors.background) {
        draw.attr({ style: `background-color: ${toRGBAStr(state.colors.background)}` })
    }
    const c = fillColors
    const v = vertices
    let vertIdx = 0
    let colIdx = 0
    const coordsPerPoly = verticesNum * 2
    while (vertIdx < v.length) {
        const coordsNum = coordsPerPoly || v[vertIdx++] // if 0 then use first number as indicator of vertices number

        // discard transparent polygons
        if (c[colIdx + 3] !== 0) {
            const rgbFill = hslToRgb(c[colIdx] / 360, c[colIdx + 1] / 100, c[colIdx + 2] / 100)

            const fillColor = toRGBHex(rgbFill)
            const fillOpacity = c[colIdx + 3]
            const borderColor = useBodyColor ? fillColor : toRGBHex(rgbaBorder)
            const borderOpacity = useBodyColor ? fillOpacity : rgbaBorder.a

            const poly = [] as [number, number][]
            for (let i = 0; i < coordsNum; i += 2) {
                poly.push([Math.round(v[vertIdx + i]), Math.round(v[vertIdx + i + 1])])
            }

            draw.polygon(poly.join(' '))
                .fill(fillBody ? fillColor : 'none')
                .stroke({
                    color: borderColor,
                    width: Math.max(1, borderWidth),
                })
                .attr({
                    ...(fillOpacity < 1 ? { 'fill-opacity': fillOpacity } : {}),
                    ...(borderOpacity < 1 ? { 'stroke-opacity': borderOpacity } : {}),
                })
        }

        vertIdx += coordsNum
        colIdx += 4
    }

    return draw
}
