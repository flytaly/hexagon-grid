import { stateObjectPropIds, mapStateToUrlParams } from './url-state'
import { testState, urlParams } from './mocks/canvas-test-state'

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
        expect(mapStateToUrlParams(testState)).toBe(urlParams)
    })
})
