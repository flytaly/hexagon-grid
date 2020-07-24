import { useMemo, useState, Dispatch, SetStateAction } from 'react'

/**
 * This hook creates local state that will be automatically updated if
 * value in upper state changes. But it won't force them to be equal every render.
 * That's why local value isn't passed as depth into useMemo.
 * The hook is useful for inputs that don't update values in upper state immediately for optimization.
 */
function useProxyState<T>(upperStateValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [localValue, setLocalValue] = useState(upperStateValue)

    useMemo(() => {
        if (upperStateValue !== localValue) {
            setLocalValue(upperStateValue)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [upperStateValue])

    return [localValue, setLocalValue]
}

export default useProxyState
