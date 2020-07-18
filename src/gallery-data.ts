import dataHash from './gallery-data-hash.json'

const prefix = 'https://res.cloudinary.com/flytaly/image/upload/v1594998717/hexagons/'

type Tile = {
    hash: string
    img: string
    cols: number
}

const galleryData: Tile[] = dataHash.map((hash, idx) => {
    const patternIdx = idx % 4
    return {
        hash: hash.hash,
        img: `${prefix}hex_${hash.id}_540p.png`,
        cols: patternIdx === 0 || patternIdx === 3 ? 2 : 1, // alternate rows between '2 cols image + 1 col image' and '1 col + 2 cols'
    }
})

export default galleryData
