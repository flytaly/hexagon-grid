import { RGBColor } from 'react-color'

import { genSeed } from '#/helpers'
import { Noises2D } from '#/noises'
import { defaultPalettes, PaletteColorsArray } from '#/palettes'
import { CanvasState } from './canvas-state-types'

export const makePaletteColors = (
    colors: RGBColor[],
    paletteId: number | string,
): PaletteColorsArray => {
    return colors.map((rgb, index) => ({
        id: `${paletteId}-${index}`,
        rgb,
    }))
}

export const initialState: CanvasState = {
    canvasSize: {
        width: 1920,
        height: 1080,
        aspect: 1920 / 1080,
        pixelRatio: 1,
        wasMeasured: false,
    },
    cell: {
        size: 2.5,
        orientation: 'pointy', // for hexagons only
        variance: 10,
        borderWidth: 0,
    },
    noise: {
        seed: genSeed(),
        zoom: 10,
        hue: 2,
        saturation: 2,
        lightness: 4,
        offsetX: 0,
        offsetY: 0,
        baseNoise: {
            id: Noises2D.diagonal.id,
            // id: 'custom',
            customFn: 'sin(x*2) + y*2',
        },
        noise2Strength: 0.2,
        imageDataString: '',
    },
    grid: {
        type: 'hexagons',
        sparse: 1,
        signX: 1,
        signY: 1,
        isXYSwapped: false,
    },
    colors: {
        border: { r: 100, g: 100, b: 100, a: 0.8 },
        useBodyColor: false,
        background: null,
        noFill: false,
        isGradient: false,
        palette: {
            isCustom: false,
            id: defaultPalettes[0].id,
            colors: makePaletteColors(defaultPalettes[0].colors, defaultPalettes[0].id),
        },
        customPalettes: [],
    },
}
