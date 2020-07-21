/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'

const useStyles = makeStyles({
    root: {
        width: '800px',
        maxWidth: '100%',
        margin: '0 auto',
        '& img': {
            maxWidth: '100%',
        },
    },
    centeredImg: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
})

const gridLinks = {
    sine:
        '/#w=300;h=200;s=5;or=p;v=10;b=0;seed=858582;nz=5;nh=0;ns=0;nl=49;nx=0;ny=0;nid=sin;n2=0.15;gt=h;gs=1;gx=1;gy=1;cb=646464,10;cbg=2d4059,0;pal=2d4059,0:af1262:af1262:af1262:2d4059,0',
}

const HelpPageContent: React.FC = () => {
    const classes = useStyles()
    const router = useRouter()

    const pushRoute = (route: string) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        router.push(route)
    }

    return (
        <div className={classes.root}>
            <Typography variant="h5" component="h3">
                About
            </Typography>
            <Typography>
                This is a tool for creating hexagonal grids. Look at{' '}
                <a href="/gallery" onClick={pushRoute('/gallery')}>
                    examples in gallery
                </a>
                . There is also an option to make triangular (trianglify like) and voronoi grids.
            </Typography>
            <br />
            <Typography variant="h5" component="h3">
                Noise
            </Typography>
            <Typography>
                Noise is a scheme for painting the grid with the selected color palette. For
                example, <b>sine wave noise</b> will paint as a sinusoid.
            </Typography>
            <a href={gridLinks.sine}>
                <img className={classes.centeredImg} src="/sine.svg" alt="sinusoid" />
            </a>
            <Typography>
                You can also pass your own arbitrary mathematical expression (
                <a href="https://github.com/silentmatt/expr-eval#unary-operators" target="_blank">
                    allowed functions
                </a>
                ). The coordinates of the cell x, y are passed to the noise function and it should
                return the value approximately in the range [-1; 1]. Basically the resulting image
                is a 2D contour plot.
            </Typography>
            <br />
            <Box pl={3}>
                <Typography variant="h6" component="h4">
                    Zoom factor
                </Typography>
                <Typography>
                    Before x, y are passed to the noise function they are divided by zoom factor.
                </Typography>
                <Typography>
                    For example, parabola <code>x^2 + y</code> with <code>zoom factor</code> 5 vs
                    zoom factor 10.
                </Typography>
                <Box display="flex" justifyContent="center" m={1} flexWrap="wrap">
                    <img src="/parabola_zoom_5.svg" alt="zoom factor 5" height="150" />
                    <img src="/parabola_zoom_10.svg" alt="zoom factor 10" height="150" />
                </Box>
                <br />
                <Typography variant="h6" component="h4">
                    Offsets
                </Typography>
                <Typography>
                    You can move the noise pattern using arrow keys on the screen or on your
                    keyboard.
                </Typography>
                <br />
                <Typography variant="h6" component="h4">
                    Second noise
                </Typography>
                <Typography>
                    A random value that added after the first noise is applied. The second noise
                    isn’t affected by offsets.
                </Typography>
            </Box>
        </div>
    )
}

export default HelpPageContent
