import { CanvasState } from '../canvas-state'

export const testState: CanvasState = {
    canvasSize: {
        width: 1920,
        height: 1080,
        aspect: 1.7777777777777777,
        pixelRatio: 1,
        wasMeasured: true,
    },
    hex: { size: 3, orientation: 'pointy', borderWidth: 1 },
    noise: {
        seed: 4814090,
        zoom: 10,
        hue: 2,
        saturation: 2,
        lightness: 4,
        offsetX: 0,
        offsetY: 0,
        baseNoise: { id: 'sin', customFn: 'sin(x*2) + y*2' },
        noise2Strength: 0,
    },
    grid: { sparse: 1, signX: 1, signY: 1 },
    colors: {
        hexBorder: { h: 0, s: 0, l: 1, a: 1 },
        background: null,
        palette: {
            isCustom: false,
            id: 'paldId',
            colors: [
                { id: '0', hsl: { h: 202, s: 0.94, l: 0.61, a: 1 } },
                { id: '1', hsl: { h: 200, s: 0.89, l: 0.6, a: 1 } },
                { id: '2', hsl: { h: 196, s: 0.84, l: 0.6, a: 0.88 } },
                { id: '3', hsl: { h: 178, s: 0.68, l: 0.57, a: 1 } },
            ],
        },
        customPalettes: [],
    },
}

const params = [
    'w=1920',
    'h=1080',
    's=3',
    'or=p',
    'b=1',
    'seed=4814090',
    'nz=10',
    'nh=2',
    'ns=2',
    'nl=4',
    'nx=0',
    'ny=0',
    'nid=sin',
    'n2=0',
    'gs=1',
    'gx=1',
    'gy=1',
    'cb=0,0,100',
    // 'cbg': '',
    'pal=202,94,61:200,89,60:196,84,60,88:178,68,57',
]

export const urlParams = params.join('&')
