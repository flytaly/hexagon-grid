import React from 'react'
import { Modal } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import HelpTabs from './help-tabs'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            position: 'absolute',
            width: 1000,
            maxWidth: '90%',
            height: 960,
            maxHeight: '90%',
            backgroundColor: theme.palette.background.paper,
            // padding: theme.spacing(2, 3, 3),
            top: `50%`,
            left: `50%`,
            transform: `translate(-50%, -50%)`,
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
                <HelpTabs />
            </div>
        </Modal>
    )
}

export default HelpModal
