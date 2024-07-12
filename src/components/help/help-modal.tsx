import { Box, Button, Modal } from '@mui/material'

import theme from '#/theme'
import HelpTabs from './help-tabs'

type HelpModalProps = {
    isOpen: boolean
    initTab?: number
    handleClose: () => void
}

function HelpModal({ isOpen, handleClose, initTab = 0 }: HelpModalProps) {
    return (
        <Modal aria-label="help page modal" open={isOpen} onClose={handleClose}>
            <Box
                maxWidth="lg"
                maxHeight={'80vh'}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute',
                    width: `calc(100% - ${theme.spacing(4)})`,
                    height: 'max-content',
                    maxHeight: '80vh',
                    inset: 0,
                    margin: 'auto',
                }}
            >
                <Box sx={{ overflowY: 'scroll' }} maxHeight="100%">
                    <HelpTabs initTab={initTab} isModal />
                </Box>
                <Button
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        marginLeft: 'auto',
                        marginRight: theme.spacing(2),
                    }}
                >
                    Dismiss
                </Button>
            </Box>
        </Modal>
    )
}

export default HelpModal
