import { createMuiTheme } from '@material-ui/core/styles'
import { red, blue, teal } from '@material-ui/core/colors'

// Create a theme instance.
const theme = createMuiTheme({
    palette: {
        primary: {
            main: blue.A700,
        },
        secondary: {
            main: teal.A700,
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#fff',
        },
    },
})

export default theme
