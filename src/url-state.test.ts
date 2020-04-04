import { stateObjectPropIds, mapStateToUrlParams, mapUrlParamsToState } from './url-state'
import { testState, testParamsQuery, testParamsEntries } from './mocks/canvas-test-state'
import { initialState } from './canvas-state'

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
        expect(mapStateToUrlParams(testState)).toBe(testParamsQuery)
    })
})

describe('params to state', () => {
    test('should return state object from URL params', () => {
        expect(
            mapUrlParamsToState(Object.fromEntries(testParamsEntries), initialState),
        ).toMatchObject(testState)
    })
})
