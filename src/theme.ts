import { amber, grey, lightBlue, red } from '@mui/material/colors'
import { LinkProps } from '@mui/material/Link'
import { createTheme } from '@mui/material/styles'
import LinkBehavior from './components/link-behavior'

const theme = createTheme({
    palette: {
        primary: {
            // main: pink[800],
            main: lightBlue[900],
        },
        secondary: {
            main: amber.A700,
        },
        error: {
            main: red.A400,
        },
        background: {
            default: grey[300],
        },
    },
    components: {
        MuiLink: {
            defaultProps: {
                component: LinkBehavior,
            } as LinkProps,
        },
        MuiButtonBase: {
            defaultProps: {
                LinkComponent: LinkBehavior,
            },
        },
    },
})

export default theme
