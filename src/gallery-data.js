import dataHash from './gallery-data-hash.json'

const prefix = 'https://res.cloudinary.com/flytaly/image/upload/v1594998717/hexagons/'

function zeroFill(num, width) {
    width -= num.toString().length
    if (width > 0) {
        return new Array(width + (/\./.test(num) ? 2 : 1)).join('0') + num
    }
    return num + ''
}

const galleryData = dataHash.map((hash, idx) => {
    const patternIdx = idx % 4
    return {
        hash,
        img: `${prefix}hex_${zeroFill(idx, 3)}_540p.png`,
        cols: patternIdx === 0 || patternIdx === 3 ? 2 : 1, // alternate rows between '2 cols image + 1 col image' and '1 col + 2 cols'
    }
})

export default galleryData
