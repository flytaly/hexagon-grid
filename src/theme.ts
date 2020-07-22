import { createMuiTheme } from '@material-ui/core/styles'
import { red, grey, lightBlue, amber } from '@material-ui/core/colors'

// Create a theme instance.
const theme = createMuiTheme({
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
})

export default theme
