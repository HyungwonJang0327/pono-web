'use client';

import { useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { User, Plus, Pencil, Check } from 'lucide-react';
import { RESERVED_USERNAMES } from '@/constants';
import { updateUserProfile } from '@/services/user.service';
import { ApiError } from '@/lib/api';

type ValidationState = 'idle' | 'valid' | 'error';

function validateUsername(
  value: string,
  t: (key: string) => string,
): { state: ValidationState; message: string } {
  if (value.length === 0) {
    return { state: 'idle', message: '' };
  }
  if (RESERVED_USERNAMES.includes(value.toLowerCase())) {
    return { state: 'error', message: t('usernameReserved') };
  }
  if (!/^[a-zA-Z0-9]+$/.test(value)) {
    return { state: 'error', message: t('usernameInvalidChars') };
  }
  if (value.length < 2) {
    return { state: 'error', message: t('usernameTooShort') };
  }
  if (value.length > 20) {
    return { state: 'error', message: t('usernameTooLong') };
  }
  return { state: 'valid', message: t('usernameAvailable') };
}

export default function OnboardingUsernamePage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const t = useTranslations('onboarding');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const { state: validationState, message: validationMessage } = validateUsername(username, t);
  const isValid = validationState === 'valid';
  const isError = validationState === 'error';

  // username이 유효하고 제출 중이 아닐 때 버튼 활성화 (아바타는 선택)
  const canSubmit = isValid && !isSubmitting;

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  }, []);

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // @ prefix 처리: 입력 값이 @로 시작하면 제거
    const raw = e.target.value.replace(/^@/, '');
    setUsername(raw);
    setConflictError(false);
    setSubmitError(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setConflictError(false);
    setSubmitError(false);
    try {
      const token = (await getToken()) ?? '';
      await updateUserProfile({ username }, token);
      router.refresh();
      router.push('/');
    } catch (err) {
      // 409(USERNAME_TAKEN)은 충돌 안내, 그 외 에러는 일반 안내 + 버튼 재활성
      if (err instanceof ApiError && (err.status === 409 || err.code === 'USERNAME_TAKEN')) {
        setConflictError(true);
      } else {
        setSubmitError(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isValid, username, getToken, router]);

  // 입력창 border 클래스 결정
  const inputBorderClass = (() => {
    if (isError) return 'border border-red-500';
    if (isFocused || isValid) return 'border border-primary-700';
    return 'border border-neutral-300';
  })();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex flex-col min-h-screen max-w-[560px] mx-auto">
      {/* 상단 로고 */}
      <div className="pt-14 pb-2 text-center">
        <span className="font-serif text-xl font-bold text-primary-700 tracking-tight">
          {t('logo')}
        </span>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col px-6 pt-8">
        {/* 헤딩 */}
        <h1 className="text-[28px] font-bold leading-tight text-neutral-900">
          {t('title')}
        </h1>
        <p className="mt-2 text-[15px] text-neutral-600">
          {t('subtitle')}
        </p>

        {/* 아바타 업로드 */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleAvatarClick}
            className="relative focus:outline-none"
            aria-label={avatarPreview ? t('changePhoto') : t('addPhoto')}
          >
            {/* 원형 아바타 */}
            <div className="w-[90px] h-[90px] rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt={t('avatarPreviewAlt')}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-neutral-400" strokeWidth={1.5} />
              )}
            </div>

            {/* 배지 */}
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center shadow-[var(--shadow-card)]">
              {avatarPreview ? (
                <Pencil className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              ) : (
                <Plus className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              )}
            </div>
          </button>

          <span className="text-[13px] text-neutral-500">
            {avatarPreview ? t('changePhoto') : t('addPhoto')}
          </span>

          {/* 숨겨진 파일 input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Username 입력 */}
        <div className="mt-10">
          <label
            htmlFor="username-input"
            className="block text-[14px] font-medium text-neutral-900 mb-2"
          >
            {t('usernameLabel')}
          </label>

          <div
            className={[
              'flex items-center rounded-[14px] bg-white px-4 h-[52px] transition-colors',
              inputBorderClass,
            ].join(' ')}
          >
            <span className="text-[15px] text-neutral-500 mr-1 select-none">@</span>
            <input
              id="username-input"
              type="text"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="username"
              value={username}
              onChange={handleUsernameChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={t('usernamePlaceholder')}
              className="flex-1 bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
            {isValid && (
              <Check className="w-4 h-4 text-primary-700 shrink-0" strokeWidth={2.5} />
            )}
          </div>

          {/* 안내/유효성 메시지 */}
          {submitError ? (
            <p className="mt-2 text-[13px] text-red-500">
              {t('submitError')}
            </p>
          ) : conflictError ? (
            <p className="mt-2 text-[13px] text-red-500">
              {t('usernameTaken')}
            </p>
          ) : username.length === 0 ? (
            <p className="mt-2 text-[13px] text-neutral-500">
              {t('usernameHint')}
            </p>
          ) : isValid ? (
            <p className="mt-2 flex items-center gap-1 text-[13px] text-primary-500">
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
              {validationMessage}
            </p>
          ) : (
            <p className="mt-2 text-[13px] text-red-500">
              {validationMessage}
            </p>
          )}
        </div>
      </div>

      {/* 하단 CTA */}
      <div className="px-6 pb-12 pt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={[
            'w-full h-12 rounded-full text-[15px] font-semibold transition-colors',
            canSubmit
              ? 'bg-primary-700 text-white active:bg-primary-800'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed',
          ].join(' ')}
        >
          {t('submit')}
        </button>
      </div>
      </div>
    </div>
  );
}
