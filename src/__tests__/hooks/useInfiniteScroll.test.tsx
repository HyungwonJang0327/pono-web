import { renderHook, act } from '@testing-library/react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

/**
 * jsdom에는 IntersectionObserver가 없으므로 수동 mock을 둔다.
 * 생성된 observer 인스턴스를 보관해, 테스트에서 교차를 임의로 트리거한다.
 */
type ObserverEntry = { isIntersecting: boolean }

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: (entries: ObserverEntry[]) => void
  observed: Element[] = []
  disconnected = false

  constructor(cb: (entries: ObserverEntry[]) => void) {
    this.callback = cb
    MockIntersectionObserver.instances.push(this)
  }

  observe(el: Element) {
    this.observed.push(el)
  }

  unobserve(el: Element) {
    this.observed = this.observed.filter((o) => o !== el)
  }

  disconnect() {
    this.disconnected = true
    this.observed = []
  }

  /** 테스트 헬퍼: 교차 상태를 강제로 발생시킨다 */
  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting }])
  }
}

beforeEach(() => {
  MockIntersectionObserver.instances = []
  // @ts-expect-error jsdom 환경에 주입
  global.IntersectionObserver = MockIntersectionObserver
})

function attachSentinel(setRef: (node: HTMLDivElement | null) => void) {
  // 콜백 ref에 실제 DOM 노드를 연결해 observe가 일어나게 한다
  const node = document.createElement('div')
  act(() => {
    setRef(node)
  })
  return node
}

describe('useInfiniteScroll', () => {
  it('sentinelRef를 반환한다', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({ onLoadMore: jest.fn(), hasMore: true, isLoading: false }),
    )
    expect(result.current.sentinelRef).toBeDefined()
  })

  it('sentinel이 교차하면 onLoadMore를 호출한다', () => {
    const onLoadMore = jest.fn()
    const { result } = renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasMore: true, isLoading: false }),
    )
    attachSentinel(result.current.sentinelRef)

    const observer = MockIntersectionObserver.instances.at(-1)!
    act(() => observer.trigger(true))

    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })

  it('교차하지 않으면(isIntersecting=false) onLoadMore를 호출하지 않는다', () => {
    const onLoadMore = jest.fn()
    const { result } = renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasMore: true, isLoading: false }),
    )
    attachSentinel(result.current.sentinelRef)

    const observer = MockIntersectionObserver.instances.at(-1)!
    act(() => observer.trigger(false))

    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('hasMore=false면 교차해도 onLoadMore를 호출하지 않는다 (관찰 중단)', () => {
    const onLoadMore = jest.fn()
    const { result } = renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasMore: false, isLoading: false }),
    )
    attachSentinel(result.current.sentinelRef)

    const observer = MockIntersectionObserver.instances.at(-1)
    if (observer) {
      act(() => observer.trigger(true))
    }
    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('isLoading=true면 교차해도 onLoadMore를 호출하지 않는다 (in-flight 가드)', () => {
    const onLoadMore = jest.fn()
    const { result } = renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasMore: true, isLoading: true }),
    )
    attachSentinel(result.current.sentinelRef)

    const observer = MockIntersectionObserver.instances.at(-1)
    if (observer) {
      act(() => observer.trigger(true))
    }
    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('언마운트 시 observer를 disconnect한다', () => {
    const { result, unmount } = renderHook(() =>
      useInfiniteScroll({ onLoadMore: jest.fn(), hasMore: true, isLoading: false }),
    )
    attachSentinel(result.current.sentinelRef)
    const observer = MockIntersectionObserver.instances.at(-1)!

    unmount()
    expect(observer.disconnected).toBe(true)
  })
})
