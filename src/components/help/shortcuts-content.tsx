import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React from 'react'

const useStyles = makeStyles({
    table: {
        width: '400px',
        maxWidth: '100%',
        margin: '0 auto',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
})

const tableRows = [
    { name: 'Select next color palette', keys: 'j' },
    { name: 'Select previous color palette', keys: 'k' },
    { name: 'Generate new color palette', keys: 'c' },
    { name: 'Toggle gradient on/off', keys: 'g' },
    { name: 'Open help page', keys: 'shift + ?' },
    { name: 'Move noise pattern (left, right, top, bottom)', keys: '← → ↑ ↓' },
    { name: 'Move noise pattern x10 faster', keys: 'shift + arrows' },
    { name: 'Select next base noise', keys: 'n' },
    { name: 'Select previous base noise', keys: 'shift + n' },
    { name: 'Increase cell size', keys: '+, =' },
    { name: 'Decrease cell size', keys: '-' },
    { name: 'Reset settings', keys: 'r' },
    { name: 'Load random pattern from gallery', keys: 'shift + r' },
    { name: 'Increase noise zoom factor', keys: ']' },
    { name: 'Decrease noise zoom factor', keys: '[' },
]

const ShortcutsContent: React.FC = () => {
    const classes = useStyles()
    const mid = Math.floor(tableRows.length / 2)
    const tables = [tableRows.slice(0, mid), tableRows.slice(mid)]
    return (
        <div>
            <Typography variant="h4" component="h2">
                Keyboard shortcuts
            </Typography>
            <TableContainer className={classes.container}>
                {tables.map((rows, idx) => (
                    <Table key={idx} className={classes.table} aria-label="Keyboard shortcuts">
                        <TableHead>
                            <TableRow>
                                <TableCell>Actions</TableCell>
                                <TableCell align="center">Keys</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="center">{row.keys}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ))}
            </TableContainer>
        </div>
    )
}

export default ShortcutsContent
