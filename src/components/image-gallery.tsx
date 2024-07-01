import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import React, { useEffect, useRef, useState } from 'react'
import { GALLERY_CELL_HEIGHT, GALLERY_COLS, GALLERY_GRID_WIDTH } from '../configs'
import galleryData from '../gallery-data'
import { Link } from '@mui/material'

type StyleProps = {
    gridWidth: number
    cellHeight: number
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
        },
        gridList: {
            display: 'flex',
            flexWrap: 'wrap',
            width: (props: StyleProps) => `${props.gridWidth}px`,
            maxWidth: '100%',
            listStyle: 'none',
            padding: 0,
            margin: 0,
        },
        gridElement: {
            height: (props: StyleProps) => `${props.cellHeight}px`,
            maxWidth: '100%',
            padding: '2px',
            margin: 0,
        },
        imageLink: {
            display: 'block',
            overflow: 'hidden',
            height: '100%',
            '& > img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform .5s cubic-bezier(0.33, 1, 0.68, 1)',
                backgroundColor: '#dfdfdf',
                lineHeight: (props: StyleProps) => `${props.cellHeight}px`,
                textAlign: 'center',
                display: 'block',
            },
            '&:focus': {
                outline: `3px solid ${theme.palette.primary.main}`,
            },
            '&:focus > img, &:hover > img': {
                transform: 'scale3d(1.14, 1.14, 1)',
            },
        },
    }),
)

type GalleryProps = {
    cols?: number
    cellHeight?: number
    gridWidth?: number
}

const ImageGallery: React.FC<GalleryProps> = ({
    cols = GALLERY_COLS,
    cellHeight = GALLERY_CELL_HEIGHT,
    gridWidth = GALLERY_GRID_WIDTH,
}) => {
    const [tilesShown, setTilesShown] = useState(10)
    const pageEndRef = useRef<HTMLDivElement>(null)

    // Defer image loading
    useEffect(() => {
        if (tilesShown >= galleryData.length) return
        if (!pageEndRef.current) return
        const options = {
            rootMargin: `${cellHeight / 2}px`,
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

    const classes = useStyles({
        cellHeight,
        gridWidth,
    } as StyleProps)

    return (
        <>
            <div className={classes.root}>
                <ul className={classes.gridList}>
                    {galleryData.slice(0, tilesShown).map((tile) => (
                        <li
                            style={{
                                width: `${(100 / cols) * tile.cols}%`,
                            }}
                            className={classes.gridElement}
                            key={tile.img}
                        >
                            <Link
                                href={`/${tile.hash}`}
                                className={classes.imageLink}
                                data-hash={tile.hash}
                            >
                                <img src={tile.img} alt="hexagon grid example" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div ref={pageEndRef} />
        </>
    )
}

export default ImageGallery
