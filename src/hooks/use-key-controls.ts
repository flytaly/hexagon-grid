import { useEffect } from 'react'
import nicePalettes from 'nice-color-palettes/1000'
import { CanvasStateAction, ActionTypes, PaletteColorsArray } from '../state/canvas-state-types'
import { toRGBaObj } from '../helpers'

export default function useKeyControls(
    dispatch: React.Dispatch<CanvasStateAction>,
    toggleShortcuts: () => void,
): void {
    useEffect(() => {
        const dispatchOffset = (dx = 0, dy = 0) => {
            dispatch({
                type: ActionTypes.INC_NOISE_OFFSET,
                payload: { dx, dy },
            })
        }
        const dispatchHexSize = (payload: number) => {
            dispatch({ type: ActionTypes.INC_CELL_SIZE, payload })
        }
        const selectNextPalette = (payload: 1 | -1 = 1) => {
            dispatch({ type: ActionTypes.SELECT_NEXT_PALETTE, payload })
        }
        const generateColorPalette = () => {
            const colors: PaletteColorsArray = nicePalettes[
                Math.floor(Math.random() * nicePalettes.length)
            ].map((c, idx) => ({
                id: `${idx}_${Date.now()}`,
                rgb: toRGBaObj(c),
            }))

            dispatch({
                type: ActionTypes.MODIFY_PALETTE,
                payload: colors,
            })
        }

        const selectNextBaseNoise = (payload: 1 | -1 = 1) => {
            dispatch({ type: ActionTypes.SELECT_NEXT_BASE_NOISE, payload })
        }
        const cb = (e: KeyboardEvent) => {
            if (e.target === document.body) {
                const shift = e.shiftKey ? 10 : 1
                switch (e.key) {
                    case 'ArrowUp':
                        dispatchOffset(0, -1 * shift)
                        break
                    case 'ArrowDown':
                        dispatchOffset(0, 1 * shift)
                        break
                    case 'ArrowLeft':
                        dispatchOffset(-1 * shift, 0)
                        break
                    case 'ArrowRight':
                        dispatchOffset(1 * shift, 0)
                        break
                    case '+':
                    case '=':
                        dispatchHexSize(+1)
                        break
                    case '-':
                        dispatchHexSize(-1)
                        break
                    default:
                }
                switch (e.keyCode) {
                    case 74: // j
                        selectNextPalette()
                        break
                    case 75: // k
                        selectNextPalette(-1)
                        break
                    case 67: // c
                        generateColorPalette()
                        break
                    case 71: // g
                        dispatch({ type: ActionTypes.TOGGLE_GRADIENT })
                        break
                    case 78: // n
                        selectNextBaseNoise(e.shiftKey ? -1 : 1)
                        break
                    case 191: // ?
                        if (e.shiftKey) {
                            toggleShortcuts()
                        }
                        break
                    default:
                }
            }
        }

        document.body.addEventListener('keydown', cb)
        return () => {
            document.body.removeEventListener('keydown', cb)
        }
    }, [dispatch, toggleShortcuts])
}
