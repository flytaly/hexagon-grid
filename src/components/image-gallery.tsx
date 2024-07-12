import { Box, Container, Link } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useRef, useState } from 'react'

import galleryData from '#/gallery-data'

const ZoomImgLink = styled(Link)(({ theme }) => ({
    display: 'block',
    overflow: 'hidden',
    height: '100%',
    '& > img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform .5s cubic-bezier(0.33, 1, 0.68, 1)',
        backgroundColor: '#dfdfdf',
        textAlign: 'center',
        display: 'block',
    },
    '&:focus': {
        outline: `3px solid ${theme.palette.primary.main}`,
    },
    '&:focus > img, &:hover > img': {
        transform: 'scale3d(1.14, 1.14, 1)',
    },
}))

// map index into alternating pattern 1, 1, 2, 2, 1, 1, 2, 2...
const alternate = (index: number) => (index % 4 < 2 ? 1 : 2)

function ImageGallery() {
    const [tilesShown, setTilesShown] = useState(14)
    const pageEndRef = useRef<HTMLDivElement>(null)

    const cellHeight = 200

    // Defer image loading
    useEffect(() => {
        if (tilesShown >= galleryData.length) return
        if (!pageEndRef.current) return
        const options = {
            rootMargin: `${cellHeight}px`,
        }
        const cb: IntersectionObserverCallback = (entries) => {
            if (entries[0].isIntersecting) {
                setTilesShown(tilesShown + 10)
            }
        }
        const observer = new IntersectionObserver(cb, options)
        observer.observe(pageEndRef.current)
        return () => {
            observer.disconnect()
        }
    }, [cellHeight, tilesShown])

    return (
        <>
            <Container maxWidth="lg">
                <Box
                    component="ul"
                    sx={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        width: '100%',
                        gap: (theme) => theme.spacing(1),
                    }}
                >
                    {galleryData.slice(0, tilesShown).map((tile, index) => (
                        <Box
                            component="li"
                            key={tile.img}
                            sx={{
                                height: cellHeight + 'px',
                                gridColumn: `span ${alternate(index + 3)}`,
                            }}
                        >
                            <ZoomImgLink href={`/${tile.hash}`} data-hash={tile.hash}>
                                <img src={tile.img} alt="hexagon grid example" />
                            </ZoomImgLink>
                        </Box>
                    ))}
                </Box>
            </Container>
            <div ref={pageEndRef} />
        </>
    )
}

export default ImageGallery
