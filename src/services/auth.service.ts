// Clerk 추상화 레이어 — 내부 구현만 교체하면 자체 인증으로 전환 가능

export const authService = {
  getUser: async (userId: string) => {
    // TODO: Clerk 연동
  },

  getCurrentUser: async () => {
    // TODO: Clerk 연동
  },

  signOut: async () => {
    // TODO: Clerk 연동
  },
}
