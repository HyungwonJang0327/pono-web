import { renderHook, waitFor, act } from '@testing-library/react'
import { useAsync } from '@/hooks/useAsync'
import { ApiError } from '@/lib/api'

describe('useAsync', () => {
  it('초기에는 isLoading=true, data/error는 null이다', () => {
    const { result } = renderHook(() => useAsync(() => new Promise(() => {})))
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('성공 시 data를 채우고 isLoading=false가 된다', async () => {
    const { result } = renderHook(() => useAsync(async () => ({ id: 'p1' })))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toEqual({ id: 'p1' })
    expect(result.current.error).toBeNull()
  })

  it('실패 시 error를 채우고 isLoading=false가 된다', async () => {
    const err = new ApiError({ status: 500, code: 'INTERNAL_ERROR' })
    const { result } = renderHook(() =>
      useAsync(async () => {
        throw err
      }),
    )
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBe(err)
    expect(result.current.data).toBeNull()
  })

  it('retry 호출 시 함수를 다시 실행하고 성공하면 error를 초기화한다', async () => {
    let attempt = 0
    const fn = jest.fn(async () => {
      attempt += 1
      if (attempt === 1) throw new ApiError({ status: 0, isNetworkError: true })
      return { id: 'ok' }
    })

    const { result } = renderHook(() => useAsync(fn))
    await waitFor(() => expect(result.current.error).not.toBeNull())

    act(() => {
      result.current.retry()
    })

    await waitFor(() => expect(result.current.data).toEqual({ id: 'ok' }))
    expect(result.current.error).toBeNull()
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
