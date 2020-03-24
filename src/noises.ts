import SimplexNoise from 'simplex-noise'
import Alea from 'alea'
import { clamp, lerp } from './helpers'

export type NoiseFn = (x: number, y: number, width?: number, height?: number) => number

export type Noises2DFns = {
    line: NoiseFn
    linesSum: NoiseFn
    linesMul: NoiseFn
    diagonal: NoiseFn

    simplex: NoiseFn
    cosMul: NoiseFn

    circle: NoiseFn
    cubic: NoiseFn
    quadratic: NoiseFn
}

export type NoisesRnd = {
    cosRandom: () => number
    rnd: (strength: number) => number
    rndAsymmetric: (left?: number, right?: number) => number
}

export type NoiseInfo = {
    id: keyof Noises2DFns
    name: string
}

// type NoisesInfoObj = Partial<Record<keyof Noises2D, NoiseInfo>>
export type NoisesInfoObj = {
    [key in keyof Noises2DFns]: NoiseInfo
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
    linesMul: {
        id: 'linesMul',
        name: 'Lines multiplication',
    },
    diagonal: {
        id: 'diagonal',
        name: 'Diagonal line',
    },
    simplex: {
        id: 'simplex',
        name: 'Simplex noise',
    },
    cosMul: {
        id: 'cosMul',
        name: 'Сos(x*y)',
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

    const noises: Noises2DFns = {
        line: (x) => n1D(x),
        linesSum: (x, y) => n1D(x) + n1D(y),
        linesMul: (x, y) => n1D(x) * n1D(y),
        diagonal: (x, y) => x + y,

        simplex: (x, y) => simplex.noise2D(x, y),
        cosMul: (x, y) => (x !== 0 ? Math.cos(y * x * 10) : Math.cos(y * 10)),
        circle: (x, y, w = 1, h = 1) => Math.sqrt((x / w) ** 2 + (y / h) ** 2) - 0.5,

        // shapes
        cubic: (x, y) => clamp(x ** 3 + y, -1, 1),
        quadratic: (x, y) => clamp(x ** 2 + y, -1, 1),
    }

    const random: NoisesRnd = {
        cosRandom: () => Math.cos(prng() * 2 * Math.PI),
        rnd: (strength = 1) => lerp(-strength, strength, prng()),
        rndAsymmetric: (left = -1, right = 1) => lerp(left, right, prng()),
    }

    return [noises, random] as [Noises2DFns, NoisesRnd]
}
