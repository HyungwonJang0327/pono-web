'use client'

import { SignIn } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const ponoAppearance = {
  variables: {
    colorPrimary: '#1F4D3A',
    colorBackground: '#FDFCF9',
    colorInputBackground: '#E8E6E1',
    colorText: '#1C1917',
    colorTextSecondary: '#6B6760',
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    borderRadius: '10px',
  },
  elements: {
    card: {
      boxShadow: '0 4px 16px rgba(28,25,23,0.10)',
      borderRadius: '16px',
    },
    formButtonPrimary: {
      borderRadius: '10px',
      height: '48px',
      fontSize: '15px',
      fontWeight: '600',
    },
    formFieldInput: {
      borderRadius: '6px',
      height: '48px',
    },
    socialButtonsBlockButton: {
      borderRadius: '8px',
      height: '44px',
      border: '1px solid #D4D1CA',
    },
    'socialButtonsBlockButton__oauth_x': { display: 'none' },
    'socialButtonsBlockButton__oauth_twitter': { display: 'none' },
  },
} as const;

export default function SignInPage() {
  const pathname = usePathname();
  const router = useRouter();
  const isSubStep = pathname !== '/sign-in';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">
      {isSubStep && (
        <div className="w-full max-w-[400px] mb-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-neutral-600 text-[14px] hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            뒤로
          </button>
        </div>
      )}
      <SignIn appearance={ponoAppearance} fallbackRedirectUrl="/sso-redirect" signUpFallbackRedirectUrl="/sso-redirect" />
    </div>
  );
}
