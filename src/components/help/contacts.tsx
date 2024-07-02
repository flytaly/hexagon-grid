import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Button } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

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
