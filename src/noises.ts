import SimplexNoise from 'simplex-noise'
import Alea from 'alea'
import { clamp, lerp } from './helpers'

export type NoiseFn = (x: number, y: number, width?: number, height?: number) => number

export type Noises2DFns = {
    line: NoiseFn
    linesSum: NoiseFn
    diagonal: NoiseFn
    diagonal1: NoiseFn
    diagonal2: NoiseFn

    simplex: NoiseFn

    circle: NoiseFn
    cubic: NoiseFn
    quadratic: NoiseFn
    sin: NoiseFn
    sinCos: NoiseFn
}

export type NoisesRnd = {
    cosRandom: () => number
    rnd: (strength: number) => number
    rndAsymmetric: (left?: number, right?: number) => number
}

export type NoiseInfo = {
    id: keyof Noises2DFns | 'custom' | 'image'
    name: string
}

// type NoisesInfoObj = Partial<Record<keyof Noises2D, NoiseInfo>>
export type NoisesInfoObj = {
    [key in keyof Noises2DFns | 'custom' | 'image']: NoiseInfo
}

export const Noises2D: NoisesInfoObj = {
    line: {
        id: 'line',
        name: 'Lines',
    },
    linesSum: {
        id: 'linesSum',
        name: 'Lines sum',
    },
    diagonal: {
        id: 'diagonal',
        name: 'Diagonal',
    },
    diagonal1: {
        id: 'diagonal1',
        name: 'Diagonal (from center)',
    },
    diagonal2: {
        id: 'diagonal2',
        name: 'Diagonal (to center)',
    },
    simplex: {
        id: 'simplex',
        name: 'Simplex noise',
    },
    circle: {
        id: 'circle',
        name: 'Circle',
    },
    cubic: {
        id: 'cubic',
        name: 'Cubic function',
    },
    quadratic: {
        id: 'quadratic',
        name: 'Quadratic function',
    },
    sin: {
        id: 'sin',
        name: 'Sine wave',
    },
    sinCos: {
        id: 'sinCos',
        name: 'Sin x Cos',
    },
    custom: {
        id: 'custom',
        name: 'Custom function',
    },
    image: {
        id: 'image',
        name: 'Image',
    },
}

export const Noises2DList = Object.keys(Noises2D) as Array<keyof typeof Noises2D>

let prevSeed: string | null = null
let simplex: SimplexNoise

export function getNoises(seed: string) {
    if (prevSeed !== seed || !simplex) {
        simplex = new SimplexNoise(String(seed))
        prevSeed = seed
    }

    const prng = Alea(seed)
    const n1D = (v: number) => simplex.noise2D(v, 0)

    const rndValue = lerp(0.1, 2, prng())

    const noises: Noises2DFns = {
        line: (x) => n1D(x),
        linesSum: (x, y) => n1D(x) + n1D(y),
        diagonal: (x, y) => clamp(x * Math.cos(Math.PI / 4) + y * Math.sin(Math.PI / 4), -1, 1),
        diagonal1: (x, y) => {
            // from center
            const val = clamp(Math.abs(x * Math.cos(Math.PI / 4) + y * Math.sin(Math.PI / 4)), 0, 1)
            return val * 2 - 1
        },
        diagonal2: (x, y) => {
            // to center
            const val = clamp(Math.abs(x * Math.cos(Math.PI / 4) + y * Math.sin(Math.PI / 4)), 0, 1)
            return val * -2 + 1
        },

        simplex: (x, y) => simplex.noise2D(x, y),
        circle: (x, y, w = 1, h = 1) => Math.sqrt((x / w) ** 2 + (y / h) ** 2) - 0.5,

        // shapes
        cubic: (x, y) => clamp(rndValue * x ** 3 + y, -1, 1),
        quadratic: (x, y) => clamp(rndValue * x ** 2 + y, -1, 1),
        sin: (x, y) => Math.sin(x * 2) + y * 2,
        sinCos: (x, y) => Math.cos(x) * Math.sin(y),
    }

    const random: NoisesRnd = {
        cosRandom: () => Math.cos(prng() * 2 * Math.PI),
        rnd: (strength = 1) => lerp(-strength, strength, prng()),
        rndAsymmetric: (left = -1, right = 1) => lerp(left, right, prng()),
    }

    return [noises, random] as [Noises2DFns, NoisesRnd]
}
