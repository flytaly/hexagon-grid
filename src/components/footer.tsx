import React from 'react'
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import GitHubIcon from '@mui/icons-material/GitHub'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        footer: {
            display: 'inline-block',
            marginBottom: '5px',
            textAlign: 'center',
            fontSize: '13px',
            '& svg': {
                verticalAlign: 'middle',
                fontSize: '1.4em',
                color: 'inherit',
            },
            '& a:active, & a:visited, & a:link, & a': {
                color: 'inherit',
                textDecoration: 'none',
            },
            '& a:hover, & svg:hover': {
                color: theme.palette.primary.main,
            },
            '& span': {
                marginRight: '5px',
                verticalAlign: 'middle',
            },
        },
    }),
)

const Footer: React.FC = () => {
    const classes = useStyles()
    const currentYear = new Date().getFullYear()
    return (
        <footer className={classes.footer}>
            <span>{currentYear}</span>
            <span>
                <a href="https://github.com/flytaly/hexagon-grid">
                    <span>Vitaly Yerofeyevsky </span>
                </a>
            </span>
            <span>
                <a href="https://github.com/flytaly/hexagon-grid" title="source code on github">
                    <GitHubIcon />
                </a>
            </span>
        </footer>
    )
}

export default Footer
