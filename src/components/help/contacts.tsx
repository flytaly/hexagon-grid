import EmailIcon from '@mui/icons-material/Email'
import GitHubIcon from '@mui/icons-material/GitHub'
import { Box, Button } from '@mui/material'

function Contacts() {
    return (
        <Box minHeight="15rem" textAlign="center">
            <Button startIcon={<EmailIcon />} href="mailto:flytaly@gmail.com">
                Email
            </Button>

            <Button startIcon={<GitHubIcon />} href="https://github.com/flytaly/hexagon-grid">
                GitHub
            </Button>
        </Box>
    )
}

export default Contacts
