import { useEffect } from 'react'
import { CanvasStateAction, ActionTypes } from '../canvas-state-types'

export default function useKeyControls(dispatch: React.Dispatch<CanvasStateAction>): void {
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
            }
        }

        document.body.addEventListener('keydown', cb)
        return () => {
            document.body.removeEventListener('keydown', cb)
        }
    }, [dispatch])
}
