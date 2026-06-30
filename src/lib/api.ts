export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3005'

/** 백엔드 표준 에러 응답 본문 형태 */
interface ApiErrorBody {
  statusCode?: number
  code?: string
  message?: string
  error?: string
  details?: string[]
}

interface ApiErrorInit {
  status: number
  code?: string
  serverMessage?: string
  isNetworkError?: boolean
  details?: string[]
}

/**
 * API 호출에서 발생한 에러를 표준화한 객체.
 * - status: HTTP 상태코드 (네트워크 오류는 0)
 * - code: 백엔드 머신 식별자 (SCREAMING_SNAKE). i18n 키 매핑에 사용.
 * - serverMessage: 백엔드 영어 메시지 (폴백 표시용)
 * - isNetworkError: fetch 자체가 reject된 경우(연결 실패 등) true
 * - details: 검증 실패 등 상세 메시지 배열
 */
export class ApiError extends Error {
  readonly status: number
  readonly code?: string
  readonly serverMessage?: string
  readonly isNetworkError: boolean
  readonly details?: string[]

  constructor(init: ApiErrorInit) {
    super(init.serverMessage ?? `API error: ${init.status}`)
    this.name = 'ApiError'
    this.status = init.status
    this.code = init.code
    this.serverMessage = init.serverMessage
    this.isNetworkError = init.isNetworkError ?? false
    this.details = init.details
    // Error 상속 시 instanceof 보정 (트랜스파일 환경 대비)
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

async function request<T>(
  path: string,
  options?: RequestInit & { token?: string },
): Promise<T> {
  const { token, ...fetchOptions } = options ?? {}

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...fetchOptions.headers,
      },
    })
  } catch (cause) {
    // fetch reject = 네트워크 단절·DNS 실패·CORS 등
    throw new ApiError({
      status: 0,
      isNetworkError: true,
      serverMessage: cause instanceof Error ? cause.message : 'Network request failed',
    })
  }

  if (!response.ok) {
    let body: ApiErrorBody = {}
    try {
      body = (await response.json()) as ApiErrorBody
    } catch {
      // 비-JSON 본문(HTML 502 페이지 등)은 무시하고 status만 보존
    }
    throw new ApiError({
      status: response.status,
      code: body.code,
      serverMessage: body.message,
      details: body.details,
    })
  }

  return response.json()
}

export const api = {
  get: <T>(path: string, token?: string) => request<T>(path, { token }),
  post: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), token }),
  patch: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), token }),
  delete: <T>(path: string, token?: string) =>
    request<T>(path, { method: 'DELETE', token }),
}
