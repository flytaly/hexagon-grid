import React from 'react'
import { Modal, Button } from '@mui/material'
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import HelpTabs from './help-tabs'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            width: '1000px',
            maxWidth: '90%',
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

type HelpModalProps = {
    isOpen: boolean
    initTab?: number
    handleClose: () => void
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, handleClose, initTab = 0 }) => {
    const classes = useStyles()
    return (
        <Modal aria-label="help page modal" open={isOpen} onClose={handleClose}>
            <div className={classes.modal}>
                <div className={classes.modalContent}>
                    <HelpTabs initTab={initTab} isModal />
                </div>
                <Button onClick={handleClose} className={classes.dismissBtn}>
                    Dismiss
                </Button>
            </div>
        </Modal>
    )
}

export default HelpModal
