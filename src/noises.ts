export type NoiseFn = (x: number, y: number) => number

export type Noises2DFns = {
    line: NoiseFn
    linesSum: NoiseFn
    linesMul: NoiseFn

    simplex: NoiseFn
    cosSimplex: NoiseFn

    cubic: (x: number, y: number) => number
    quadratic: (x: number, y: number) => number
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
    simplex: {
        id: 'simplex',
        name: 'Simplex noise',
    },
    cosSimplex: {
        id: 'cosSimplex',
        name: 'Cosine noise',
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
