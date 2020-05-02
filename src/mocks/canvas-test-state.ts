import { CanvasState } from '../canvas-state-types'

export const testState: CanvasState = {
    canvasSize: {
        width: 1080,
        height: 540,
        aspect: 2,
        pixelRatio: 1,
        wasMeasured: true,
    },
    cell: { size: 5, orientation: 'flat', borderWidth: 2, variance: 20 },
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
        imageDataString: '',
    },
    grid: { type: 'triangles', sparse: 2, signX: -1, signY: -1 },
    colors: {
        border: { r: 7, g: 193, b: 239, a: 0.2 },
        background: null,
        noFill: false,
        useBodyColor: true,
        isGradient: true,
        palette: {
            isCustom: true,
            id: 0,
            colors: [
                { id: 0, rgb: { r: 67, g: 193, b: 239, a: 1 } },
                { id: 1, rgb: { r: 71, g: 220, b: 215, a: 1 } },
                { id: 2, rgb: { r: 165, g: 207, b: 175, a: 0.88 } },
                { id: 3, rgb: { r: 243, g: 188, b: 98, a: 0.6 } },
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
    ['v', '20'],
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
    ['cb', '07C1EF,20'],
    ['cbb', 'y'],
    ['gr', 'y'],
    ['pal', '43C1EF:47DCD7:A5CFAF,88:F3BC62,60'],
]

export const testParamsQuery = testParamsEntries.map((p) => p.join('=')).join(';')
