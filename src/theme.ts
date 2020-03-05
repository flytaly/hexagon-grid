import { createMuiTheme } from '@material-ui/core/styles'
import { red, teal, grey, pink } from '@material-ui/core/colors'

// Create a theme instance.
const theme = createMuiTheme({
    palette: {
        primary: {
            main: pink[800],
        },
        secondary: {
            main: teal.A700,
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
