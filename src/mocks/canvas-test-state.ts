import { CanvasState } from '../canvas-state-types'

export const testState: CanvasState = {
    canvasSize: {
        width: 1080,
        height: 540,
        aspect: 2,
        pixelRatio: 1,
        wasMeasured: true,
    },
    cell: { size: 5, orientation: 'flat', borderWidth: 2 },
    noise: {
        seed: 4814090,
        zoom: 13,
        hue: 22,
        saturation: 1,
        lightness: 2,
        offsetX: 2,
        offsetY: 10,
        baseNoise: { id: 'sin', customFn: 'sin(x*2) + y*2' },
        noise2Strength: 3,
    },
    grid: { type: 'triangles', sparse: 2, signX: -1, signY: -1 },
    colors: {
        border: { h: 10, s: 0.3, l: 1, a: 0.4 },
        background: null,
        palette: {
            isCustom: true,
            id: 0,
            colors: [
                { id: 0, hsl: { h: 202, s: 0.94, l: 0.61, a: 1 } },
                { id: 1, hsl: { h: 200, s: 0.89, l: 0.6, a: 1 } },
                { id: 2, hsl: { h: 196, s: 0.84, l: 0.6, a: 0.88 } },
                { id: 3, hsl: { h: 178, s: 0.68, l: 0.57, a: 1 } },
            ],
        },
        customPalettes: [],
    },
}

export const testParamsEntries = [
    ['w', '1080'],
    ['h', '540'],
    ['s', '5'],
    ['or', 'f'],
    ['b', '2'],
    ['seed', '4814090'],
    ['nz', '13'],
    ['nh', '22'],
    ['ns', '1'],
    ['nl', '2'],
    ['nx', '2'],
    ['ny', '10'],
    ['nid', 'sin'],
    ['n2', '3'],
    ['gt', 't'],
    ['gs', '2'],
    ['gx', '-1'],
    ['gy', '-1'],
    ['cb', '10,30,100,40'],
    // ['cbg', ''],
    ['pal', '202,94,61:200,89,60:196,84,60,88:178,68,57'],
]

export const testParamsQuery = testParamsEntries.map((p) => p.join('=')).join(';')
