import RouterAppbar from '#/components/router-appbar'
import { Box, Container, Paper } from '@mui/material'

import HelpTabs from './help-tabs'

type ContainerProps = {
    initTab?: 0 | 1 | 2
}

function HelpPageContainer({ initTab = 0 }: ContainerProps) {
    return (
        <>
            <RouterAppbar />
            <Box paddingX={2} paddingY={3} width="100%">
                <Container maxWidth="lg">
                    <Paper>
                        <HelpTabs initTab={initTab} />
                    </Paper>
                </Container>
            </Box>
        </>
    )
}

export default HelpPageContainer
