import GitHubIcon from '@mui/icons-material/GitHub'
import { Container, Link, Stack } from '@mui/material'

function Footer() {
    const currentYear = new Date().getFullYear()
    return (
        <Container component="footer">
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" pb={0.5}>
                <span>{currentYear}</span>
                <Link
                    href="https://github.com/flytaly/hexagon-grid"
                    sx={{
                        color: 'inherit',
                        ':hover': { color: 'primary.main' },
                    }}
                    underline="none"
                    variant="body2"
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <span>Vitaly Yerofeyevsky</span>
                        <GitHubIcon fontSize="small" />
                    </Stack>
                </Link>
            </Stack>
        </Container>
    )
}

export default Footer
