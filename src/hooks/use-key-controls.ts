import { useEffect } from 'react'
import { CanvasStateAction, ActionTypes } from '../state/canvas-state-types'
import { getNicePalette } from '../palettes'
import galleryList from '../gallery-data'

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
            dispatch({
                type: ActionTypes.MODIFY_PALETTE,
                payload: getNicePalette(),
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
                    case 82: // r (r - reset setting, shift+R - random from gallery)
                        if (e.shiftKey) {
                            const { hash } = galleryList[
                                Math.floor(Math.random() * galleryList.length)
                            ]
                            dispatch({
                                type: ActionTypes.MERGE_STATE_FROM_QUERY,
                                payload: { hash, skipCanvasSize: true },
                            })
                        } else {
                            dispatch({ type: ActionTypes.RESET_SETTINGS })
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
