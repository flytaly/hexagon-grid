import React from 'react'
import {
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

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
    { name: 'Select next base noise', keys: 'n' },
    { name: 'Select previous base noise', keys: 'shift + n' },
    { name: "Increase cell's size", keys: '+, =' },
    { name: "Decrease cell's size", keys: '-' },
    { name: 'Reset settings', keys: 'r' },
    { name: 'Load random pattern from gallery', keys: 'shift + r' },
]

const ShortcutsContent: React.FC = () => {
    const classes = useStyles()
    const mid = Math.floor(tableRows.length / 2)
    const tables = [tableRows.slice(0, mid), tableRows.slice(mid)]
    return (
        <div>
            <Typography variant="h4">Keyboard shortcuts</Typography>
            <TableContainer className={classes.container}>
                {tables.map((rows, idx) => (
                    // eslint-disable-next-line react/no-array-index-key
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
