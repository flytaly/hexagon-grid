import { FileCopy, Image } from '@mui/icons-material'
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Modal,
    Popover,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material'
import { RefObject, useRef, useState } from 'react'

import { PolygonData } from '#/grid-generators/draw-polygons'
import renderSVG from '#/grid-generators/render-svg'
import { CanvasState } from '#/state/canvas-state-types'
import { mapStateToUrlParams } from '#/state/url-state'

type ExportModalProps = {
    canvas: RefObject<HTMLCanvasElement>
    state: CanvasState
    isOpen: boolean
    polygonData: PolygonData
    handleClose: () => void
}

function ExportModal({ canvas, isOpen, handleClose, polygonData, state }: ExportModalProps) {
    const [copyLink, setCopyLink] = useState('')
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const popoverAnchor = useRef(null)
    const theme = useTheme()

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
            <Box
                sx={{
                    position: 'absolute',
                    width: 'max-content',
                    height: 'max-content',
                    maxWidth: '90%',
                    backgroundColor: theme.palette.background.paper,
                    border: '2px solid #000',
                    boxShadow: theme.shadows[5],
                    padding: theme.spacing(5),
                    inset: 0,
                    margin: 'auto',
                }}
                ref={popoverAnchor}
            >
                <Stack gap={2} minWidth={240} maxWidth="100%">
                    <Typography variant="h5" component="h2">
                        Export
                    </Typography>
                    <Button variant="contained" startIcon={<Image />} onClick={pngClickHandler}>
                        PNG
                    </Button>
                    <Button variant="contained" startIcon={<Image />} onClick={svgClickHandler}>
                        SVG
                    </Button>
                    {!copyLink || isCustomFn ? (
                        <Button
                            variant="contained"
                            startIcon={<FileCopy />}
                            onClick={linkClickHandler}
                            disabled={isCustomFn}
                        >
                            {isCustomFn
                                ? "Copy Link (doesn't work with custom function)"
                                : 'Copy Link'}
                        </Button>
                    ) : (
                        <TextField
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
                        <Box
                            sx={{
                                border: '1px solid',
                                padding: theme.spacing(1),
                                backgroundColor: theme.palette.background.paper,
                            }}
                        >
                            Link copied
                        </Box>
                    </Popover>
                </Stack>
            </Box>
        </Modal>
    )
}

export default ExportModal
