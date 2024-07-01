import React, { RefObject, useState, useRef } from 'react'
import { Modal, Button, IconButton, Popover, TextField, InputAdornment } from '@mui/material'
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { Image, FileCopy } from '@mui/icons-material'
import { CanvasState } from '../state/canvas-state-types'
import { mapStateToUrlParams } from '../state/url-state'
import renderSVG from '../grid-generators/render-svg'
import { PolygonData } from '../grid-generators/draw-polygons'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: 300,
            maxWidth: '90%',
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 3, 3),
            top: `50%`,
            left: `50%`,
            transform: `translate(-50%, -50%)`,
            '& > *': {
                marginBottom: theme.spacing(2),
            },
        },
        fullWidth: {
            width: '100%',
        },
        popper: {
            border: '1px solid',
            padding: theme.spacing(1),
            backgroundColor: theme.palette.background.paper,
        },
    }),
)

type ExportModalProps = {
    canvas: RefObject<HTMLCanvasElement>
    state: CanvasState
    isOpen: boolean
    polygonData: PolygonData
    handleClose: () => void
}

const ExportModal: React.FC<ExportModalProps> = ({
    canvas,
    isOpen,
    handleClose,
    polygonData,
    state,
}) => {
    const classes = useStyles()
    const [copyLink, setCopyLink] = useState('')
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const popoverAnchor = useRef(null)

    const isCustomFn = state.noise.baseNoise.id === 'custom'

    const pngClickHandler = () => {
        if (!canvas.current) return
        const link = document.createElement('a')
        link.download = `${state.grid.type}.png`
        link.href = canvas.current.toDataURL('image/png')
        link.click()
    }
    const svgClickHandler = () => {
        const svg = renderSVG({ state, polygonData })
        const link = document.createElement('a')
        link.download = `${state.grid.type}.svg`
        link.href = `data:image/svg+xml;base64,${btoa(svg.node.outerHTML)}`
        link.click()
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(
            () => setIsPopoverOpen(true),
            () => console.error('Failed copy to clipboard'),
        )
    }

    const linkClickHandler = () => {
        const params = mapStateToUrlParams(state)
        const link = `${window.location.origin}/#${params}`
        setCopyLink(link)
        copyToClipboard(link)
    }

    const closeModalHandler = () => {
        setCopyLink('')
        handleClose()
    }

    return (
        <Modal aria-label="export modal" open={isOpen} onClose={closeModalHandler}>
            <div className={classes.modal} ref={popoverAnchor}>
                <h2>Export</h2>
                <Button
                    className={classes.fullWidth}
                    variant="contained"
                    startIcon={<Image />}
                    onClick={pngClickHandler}
                >
                    PNG
                </Button>
                <Button
                    className={classes.fullWidth}
                    variant="contained"
                    startIcon={<Image />}
                    onClick={svgClickHandler}
                >
                    SVG
                </Button>
                {!copyLink || isCustomFn ? (
                    <Button
                        className={classes.fullWidth}
                        variant="contained"
                        startIcon={<FileCopy />}
                        onClick={linkClickHandler}
                        disabled={isCustomFn}
                    >
                        {isCustomFn ? "Copy Link (doesn't work with custom function)" : 'Copy Link'}
                    </Button>
                ) : (
                    <TextField
                        className={classes.fullWidth}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton
                                        size="small"
                                        title="Copy link"
                                        onClick={() => copyToClipboard(copyLink)}
                                    >
                                        <FileCopy />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        size="small"
                        value={copyLink}
                    />
                )}
                <Popover
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                    }}
                    open={isPopoverOpen}
                    onClose={() => {
                        setIsPopoverOpen(false)
                    }}
                    anchorEl={popoverAnchor.current}
                >
                    <div className={classes.popper}>Link copied</div>
                </Popover>
            </div>
        </Modal>
    )
}

export default ExportModal
