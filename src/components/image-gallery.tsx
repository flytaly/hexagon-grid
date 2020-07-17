import React from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import galleryData from '../gallery-data'

type StyleProps = {
    gridWidth: string | number
    cellHeight: string | number
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
            width: (props: StyleProps) => props.gridWidth,
            maxWidth: '100%',
            listStyle: 'none',
            padding: 0,
            margin: 0,
        },
        gridElement: {
            height: (props: StyleProps) => props.cellHeight,
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

const ImageGallery: React.FC = () => {
    const router = useRouter()

    const COLS = 3

    const classes = useStyles({
        cellHeight: '200px',
        gridWidth: '960px',
    } as StyleProps)

    const clickHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        router.push(`/${e.currentTarget.dataset.hash}`)
    }

    return (
        <>
            <div className={classes.root}>
                <ul className={classes.gridList}>
                    {galleryData.map((tile) => (
                        <li
                            style={{
                                width: `${(100 / COLS) * tile.cols}%`,
                            }}
                            className={classes.gridElement}
                            key={tile.img}
                        >
                            <a
                                onClick={clickHandler}
                                href={`/${tile.hash}`}
                                className={classes.imageLink}
                                data-hash={tile.hash}
                            >
                                <img src={tile.img} alt="hexagon grid example" />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default ImageGallery
