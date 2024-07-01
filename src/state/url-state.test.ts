import { describe, expect, test, mock } from 'bun:test'
import { testParamsEntries, testParamsQuery, testState } from '../mocks/canvas-test-state'
import { initialState } from './canvas-state'
import { mapStateToUrlParams, mapUrlParamsToState, stateObjectPropIds } from './url-state'

describe('state to url', () => {
    test('all ids should be unique or null', () => {
        const propIds: string[] = []

        const checkProperties = (obj: Record<string, unknown>) =>
            (Object.keys(obj) as Array<keyof typeof obj>).forEach((k) => {
                if (obj[k] === null) return
                if (typeof obj[k] === 'object') {
                    checkProperties(obj[k] as Record<string, unknown>)
                    return
                }
                propIds.push(obj[k] as string)
            })

        checkProperties(stateObjectPropIds)

        const unique = new Set(propIds)

        expect(propIds).toHaveLength(unique.size)
    })

    test('should return string with URL params', () => {
        expect(mapStateToUrlParams(testState).toLowerCase()).toBe(testParamsQuery.toLowerCase())
    })

    test('should omit falsy boolean values', () => {
        const noFillInitValue = testState.colors.noFill
        const useBodyColorInitValue = testState.colors.useBodyColor
        const isXYSwappedInitValue = testState.grid.isXYSwapped

        testState.colors.noFill = true
        testState.colors.useBodyColor = true
        testState.grid.isXYSwapped = true
        expect(mapStateToUrlParams(testState)).toMatch(/.*nf=y;.*/)
        expect(mapStateToUrlParams(testState)).toMatch(/.*cbb=y;.*/)
        expect(mapStateToUrlParams(testState)).toMatch(/.*gxy=y;.*/)

        testState.colors.noFill = false
        testState.colors.useBodyColor = false
        testState.grid.isXYSwapped = false
        expect(mapStateToUrlParams(testState)).not.toMatch(/.*nf=.*/)
        expect(mapStateToUrlParams(testState)).not.toMatch(/.*cbb=.*/)
        expect(mapStateToUrlParams(testState)).not.toMatch(/.*gxy=.*/)

        testState.colors.noFill = noFillInitValue
        testState.colors.useBodyColor = useBodyColorInitValue
        testState.grid.isXYSwapped = isXYSwappedInitValue
    })
})

describe('params to state', () => {
    test('should return state object from URL params', () => {
        const dateNowFn = Date.now
        Date.now = mock(() => 0)
        expect(
            mapUrlParamsToState(Object.fromEntries(testParamsEntries), initialState),
        ).toMatchObject(testState)
        Date.now = dateNowFn
    })
})
