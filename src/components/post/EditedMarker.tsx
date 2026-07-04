'use client'

import { useTranslations } from 'next-intl'

interface EditedMarkerProps {
  isEdited: boolean
}

/**
 * 작성 시간 뒤에 붙는 "수정됨" 표시.
 * 캡션/본문이 실제로 수정된 경우(isEdited === true)에만 노출한다.
 * 앞의 "·" 구분자와 텍스트 모두 #B5B1A8(neutral-400).
 */
export function EditedMarker({ isEdited }: EditedMarkerProps) {
  const t = useTranslations('post')
  if (!isEdited) return null
  return (
    <>
      <span className="text-xs text-neutral-400" aria-hidden="true">
        ·
      </span>
      <span className="text-xs text-neutral-400">{t('edited')}</span>
    </>
  )
}
