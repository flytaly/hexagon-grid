import { useMemo } from 'react'
import SimplexNoise from 'simplex-noise'
import Alea from 'alea'
import { lerp, clamp } from '../helpers'

export function useNoises(seed: string) {
    const simplex = useMemo(() => new SimplexNoise(seed), [seed])
    const prng = Alea(seed)
    const n1D = (v: number) => simplex.noise2D(v, 0)

    return {
        line: (x: number) => n1D(x),
        linesSum: (x: number, y: number) => n1D(x) + n1D(y),
        // rectangles{}
        linesMul: (x: number, y: number) => n1D(x) * n1D(y),

        simplex: (x: number, y: number) => simplex.noise2D(x, y),

        cosSimplex: (x: number, y: number) => Math.cos(1 / simplex.noise2D(x, y)),
        cosRandom: () => Math.cos(prng() * 2 * Math.PI),

        rnd: (strength = 1) => lerp(-strength, strength, prng()),
        rndAsymmetric: (left = -1, right = 1) => lerp(left, right, prng()),

        cubic: (x: number, y: number) => clamp(x ** 3 + y, -1, 1),
        quadratic: (x: number, y: number) => clamp(x ** 2 + y, -1, 1),
    }
}
