import React from 'react'
import { Modal, Button } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import HelpTabs from './help-tabs'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            width: '1000px',
            maxWidth: '90%',
            height: '960px',
            maxHeight: '90%',
            backgroundColor: theme.palette.background.paper,
            // padding: theme.spacing(2, 3, 3),
            top: `50%`,
            left: `50%`,
            transform: `translate(-50%, -50%)`,
        },
        dismissBtn: {
            marginTop: 'auto',
            marginLeft: 'auto',
        },
        modalContent: {
            overflowY: 'scroll',
        },
    }),
)

type ExportModalProps = {
    isOpen: boolean
    handleClose: () => void
}

const HelpModal: React.FC<ExportModalProps> = ({ isOpen, handleClose }) => {
    const classes = useStyles()
    return (
        <Modal aria-label="help page modal" open={isOpen} onClose={handleClose}>
            <div className={classes.modal}>
                <div className={classes.modalContent}>
                    <HelpTabs />
                </div>
                <Button onClick={handleClose} className={classes.dismissBtn}>
                    Dismiss
                </Button>
            </div>
        </Modal>
    )
}

export default HelpModal
