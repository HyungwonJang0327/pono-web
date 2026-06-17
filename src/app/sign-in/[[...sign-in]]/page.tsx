import { SignIn } from "@clerk/nextjs";

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
  },
} as const;

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <SignIn appearance={ponoAppearance} />
    </div>
  );
}
