import { useState, useEffect, useMemo } from 'react'
import { CanvasState } from '../canvas-state-types'
import { getGridCellSizes, getHexCellSize } from '../grid-generators/get-sizes'
import { drawImageProp } from '../draw-image'

type ImageInfo = {
    cellsNumW?: number | null
    cellsNumH?: number | null
    imgStr?: string | null
    imgData?: Uint8ClampedArray | null
    imgElem?: HTMLImageElement | null
}

const getImgData = (width: number, height: number, imgElem: HTMLImageElement) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    drawImageProp(ctx, imgElem)
    return ctx?.getImageData(0, 0, width, height).data
}

export const useDataFromImageEffect = (state: CanvasState, genGridWorker: Worker | null): void => {
    const [imageInfo, setImageInfo] = useState<ImageInfo>({})

    const { cellsNumW, cellsNumH } = useMemo(() => {
        return state.grid.type === 'hexagons'
            ? getHexCellSize(state.cell, state.canvasSize, state.grid)
            : getGridCellSizes(state.cell.size, state.canvasSize)
    }, [state.canvasSize, state.cell, state.grid])

    useEffect(() => {
        if (state.noise.baseNoise.id !== 'image' || !state.noise.imageDataString) return
        if (
            cellsNumW !== imageInfo.cellsNumW ||
            cellsNumH !== imageInfo.cellsNumH ||
            state.noise.imageDataString !== imageInfo.imgStr ||
            !imageInfo.imgData
        ) {
            if (state.noise.imageDataString !== imageInfo.imgStr || !imageInfo.imgElem) {
                // load image and get data from canvas
                const imgElem = imageInfo.imgElem || new Image()
                imgElem.onload = () => {
                    setImageInfo({
                        imgStr: state.noise.imageDataString,
                        imgElem,
                        cellsNumW,
                        cellsNumH,
                        imgData: getImgData(cellsNumW, cellsNumH, imgElem),
                    })
                }
                imgElem.src = state.noise.imageDataString
            } else {
                // get image data from canvas
                setImageInfo((obj) => ({
                    ...obj,
                    cellsNumW,
                    cellsNumH,
                    imgData: getImgData(
                        cellsNumW,
                        cellsNumH,
                        imageInfo.imgElem as HTMLImageElement,
                    ),
                }))
            }
            return
        }
        genGridWorker?.postMessage({ state, imgData: imageInfo.imgData })
    }, [
        cellsNumH,
        cellsNumW,
        genGridWorker,
        genGridWorker?.postMessage,
        imageInfo,
        setImageInfo,
        state,
    ])
}
