import React from 'react'
import { Button } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import EmailIcon from '@material-ui/icons/Email'
import GitHubIcon from '@material-ui/icons/GitHub'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            textAlign: 'center',
            minHeight: '250px',
        },
    }),
)

const Contacts: React.FC = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Button startIcon={<EmailIcon />} href="mailto:flytaly@gmail.com">
                Email
            </Button>

            <Button startIcon={<GitHubIcon />} href="https://github.com/flytaly/hexagon-grid">
                GitHub
            </Button>
        </div>
    )
}

export default Contacts
