import { CanvasState } from '#/state/canvas-state-types'
import { genDelaunayData } from './delaunay'
import { genHexData } from './hex-data'

self.addEventListener('message', (event) => {
    if (!event.data?.state) return

    const { state, imgData } = event.data as {
        state: CanvasState
        imgData: Uint8ClampedArray | null
    }

    const hexDrawData =
        state.grid.type === 'hexagons'
            ? genHexData(state, imgData)
            : genDelaunayData(state, state.grid.type, imgData)

    self.postMessage(hexDrawData)
})

export default {} as typeof Worker & (new () => Worker)
