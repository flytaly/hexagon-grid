import { Parser } from 'expr-eval'

import { NoiseFn, Noises2DFns } from '#/noises'
import { BaseNoise } from '#/state/canvas-state-types'

export function getNoiseFn(noises: Noises2DFns, baseNoise: BaseNoise) {
    let noiseFn: NoiseFn | undefined

    if (baseNoise.id === 'custom') {
        try {
            const expr = Parser.parse(baseNoise.customFn || '')
            // testing evaluation to throw an error if an expression is incorrect
            expr.evaluate({ x: 1, y: 1, w: 1, h: 1 })
            noiseFn = (x, y, w = 1, h = 1) => expr.evaluate({ x, y, w, h })
        } catch (e) {
            console.warn(e)
        }
    } else if (baseNoise.id === 'image') {
        noiseFn = () => 0
    } else {
        noiseFn = noises[baseNoise.id]
    }

    return noiseFn
}
