import { useMemo } from 'react'
import SimplexNoise from 'simplex-noise'
import Alea from 'alea'
import { lerp, clamp } from '../helpers'
import { Noises2DFns, NoisesRnd } from '../noises'

export function useNoises(seed: string) {
    const simplex = useMemo(() => new SimplexNoise(seed), [seed])
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
