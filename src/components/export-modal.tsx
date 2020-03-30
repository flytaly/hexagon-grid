import React, { RefObject } from 'react'
import { Modal, Button } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Image } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: 200,
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
    }),
)

type ExportModalProps = {
    canvas: RefObject<HTMLCanvasElement>
    isOpen: boolean
    handleClose: () => void
}

const ExportModal = ({ canvas, isOpen, handleClose }: ExportModalProps) => {
    const classes = useStyles()
    return (
        <Modal aria-label="export modal" open={isOpen} onClose={handleClose}>
            <div className={classes.modal}>
                <h2>Export</h2>
                <Button variant="contained" startIcon={<Image />}>
                    PNG
                </Button>
            </div>
        </Modal>
    )
}

export default ExportModal
