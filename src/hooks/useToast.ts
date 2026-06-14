'use client'

import { useToastContext } from '@/components/ui/Toast'

/**
 * Toast 알림을 표시하는 훅.
 *
 * 사용 예:
 *   const toast = useToast()
 *   toast.success('저장되었습니다.')
 *   toast.error('오류가 발생했습니다.')
 *   toast.info('알림 메시지')
 *
 * ToastProvider 하위에서만 호출 가능.
 */
export function useToast() {
  return useToastContext()
}
