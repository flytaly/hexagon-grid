import React from 'react'
import { Button } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import EmailIcon from '@mui/icons-material/Email'
import GitHubIcon from '@mui/icons-material/GitHub'

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
