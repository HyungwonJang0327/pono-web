'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { ApiError } from '@/lib/api'

/**
 * 백엔드 표준 ErrorCode 목록 (SCREAMING_SNAKE).
 * 이 목록에 있는 code만 errors.<code> 키로 직접 매핑하고,
 * 그 외(미지의 code·code 없음·네트워크·비-ApiError)는 errors.default로 폴백한다.
 */
const KNOWN_ERROR_CODES = new Set<string>([
  'VALIDATION_FAILED',
  'INTERNAL_ERROR',
  'NOT_FOUND',
  'CONFLICT',
  'UNAUTHORIZED_MISSING_HEADER',
  'UNAUTHORIZED_INVALID_TOKEN',
  'UNAUTHORIZED_FOLLOWING_FEED',
  'WEBHOOK_NOT_CONFIGURED',
  'WEBHOOK_MISSING_HEADERS',
  'WEBHOOK_MISSING_BODY',
  'WEBHOOK_INVALID_SIGNATURE',
  'USER_NOT_FOUND',
  'USERNAME_RESERVED',
  'USERNAME_TAKEN',
  'POST_NOT_FOUND',
  'SNAP_IMAGE_REQUIRED',
  'ARTICLE_TITLE_REQUIRED',
  'FORBIDDEN_POST_UPDATE',
  'FORBIDDEN_POST_DELETE',
  'ALREADY_LIKED',
  'COMMENT_NOT_FOUND',
  'PARENT_COMMENT_NOT_FOUND',
  'COMMENT_DEPTH_EXCEEDED',
  'FORBIDDEN_COMMENT_DELETE',
  'CANNOT_FOLLOW_SELF',
  'ALREADY_FOLLOWING',
])

/**
 * ApiError(또는 임의의 에러)를 현지화된 사용자 메시지로 변환하는 함수를 반환한다.
 * code가 알려진 값이면 errors.<code>, 아니면 errors.default를 사용한다.
 */
export function useErrorMessage() {
  const t = useTranslations('errors')

  return useCallback(
    (error: unknown): string => {
      if (error instanceof ApiError && error.code && KNOWN_ERROR_CODES.has(error.code)) {
        return t(error.code)
      }
      return t('default')
    },
    [t],
  )
}
