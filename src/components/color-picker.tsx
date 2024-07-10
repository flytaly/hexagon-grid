import { Box, IconButton, IconButtonProps, Input, Stack, styled } from '@mui/material'
import { colord } from 'colord'
import { useState } from 'react'
import { HexAlphaColorPicker } from 'react-colorful'
import { useDebouncyEffect } from 'use-debouncy'

export const ColorButton = styled(IconButton)<IconButtonProps & { bgcolor?: string }>(
    ({ theme, bgcolor: bgcolor }) => ({
        border: '1px solid grey',
        borderRadius: '3px',
        padding: 0,
        height: '1rem',
        width: '1rem',
        backgroundColor: bgcolor || 'transparent',
        '&:hover, &:focus': { opacity: 0.6 },
        '&:focus': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '1px',
        },
    }),
)

type Props = {
    color: RGBColor | string
    onChange: (color: RGBColor) => void
    presetColors: string[]
}

export default function ColorPicker({ color, onChange, presetColors }: Props) {
    const [pickerValue, setPickerValue] = useState<string>(() => colord(color).toHex())
    const [inputValue, setInputValue] = useState(pickerValue)
    const handler = (c: string) => {
        setInputValue(c)
        setPickerValue(c)
    }

    useDebouncyEffect(() => onChange(colord(pickerValue).toRgb()), 200, [pickerValue])

    return (
        <Box padding={2}>
            <Stack gap={1}>
                <HexAlphaColorPicker color={pickerValue} onChange={handler} />
                <Input
                    size="small"
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value)
                    }}
                    onBlur={() => {
                        handler(colord(inputValue).toHex())
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handler(colord(inputValue).toHex())
                        }
                    }}
                />
                <Stack gap="0.25rem" direction="row" flexWrap="wrap">
                    {presetColors.map((color) => (
                        <ColorButton
                            bgcolor={color}
                            key={color}
                            onClick={() => handler(colord(color).toHex())}
                        />
                    ))}
                </Stack>
            </Stack>
        </Box>
    )
}
