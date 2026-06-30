import { renderHook } from '@testing-library/react'
import { useErrorMessage } from '@/hooks/useErrorMessage'
import { ApiError } from '@/lib/api'

describe('useErrorMessage', () => {
  it('알려진 code를 가진 ApiError → errors.<code> 키를 반환한다', () => {
    const { result } = renderHook(() => useErrorMessage())
    const err = new ApiError({ status: 404, code: 'POST_NOT_FOUND' })
    expect(result.current(err)).toBe('errors.POST_NOT_FOUND')
  })

  it('code가 없는 ApiError → errors.default를 반환한다', () => {
    const { result } = renderHook(() => useErrorMessage())
    const err = new ApiError({ status: 500 })
    expect(result.current(err)).toBe('errors.default')
  })

  it('네트워크 에러 → errors.default를 반환한다', () => {
    const { result } = renderHook(() => useErrorMessage())
    const err = new ApiError({ status: 0, isNetworkError: true })
    expect(result.current(err)).toBe('errors.default')
  })

  it('매핑되지 않은(미지의) code → errors.default를 반환한다', () => {
    const { result } = renderHook(() => useErrorMessage())
    const err = new ApiError({ status: 400, code: 'SOME_UNKNOWN_CODE' })
    expect(result.current(err)).toBe('errors.default')
  })

  it('ApiError가 아닌 일반 에러 → errors.default를 반환한다', () => {
    const { result } = renderHook(() => useErrorMessage())
    expect(result.current(new Error('boom'))).toBe('errors.default')
  })
})
