'use client'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FollowListClient from '@/app/(main)/[username]/FollowListClient'
import type { FollowUserDto } from '@/types/user'

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ getToken: jest.fn().mockResolvedValue('token') }),
  useUser: () => ({ user: { username: 'me' } }),
  SignInButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('@/components/ui', () => ({
  useToastContext: () => ({ error: jest.fn() }),
}))

jest.mock('@/services/user.service', () => ({
  followUser: jest.fn().mockResolvedValue(undefined),
  unfollowUser: jest.fn().mockResolvedValue(undefined),
}))

const mockList: FollowUserDto[] = [
  { id: 'u1', username: 'alice', avatar: null, bio: '안녕', isFollowedByMe: false },
  { id: 'u2', username: 'bob', avatar: null, bio: null, isFollowedByMe: true },
  { id: 'u3', username: 'me', avatar: null, bio: null, isFollowedByMe: false },
]

describe('FollowListClient', () => {
  it('유저 목록을 렌더링한다', () => {
    render(<FollowListClient list={mockList} title="팔로워" />)
    expect(screen.getByText('alice')).toBeInTheDocument()
    expect(screen.getByText('bob')).toBeInTheDocument()
  })

  it('isFollowedByMe가 false인 유저에게 "팔로우" 버튼을 표시한다', () => {
    render(<FollowListClient list={mockList} title="팔로워" />)
    expect(screen.getByRole('button', { name: '팔로우' })).toBeInTheDocument()
  })

  it('isFollowedByMe가 true인 유저에게 "팔로잉" 버튼을 표시한다', () => {
    render(<FollowListClient list={mockList} title="팔로워" />)
    expect(screen.getByRole('button', { name: '팔로잉' })).toBeInTheDocument()
  })

  it('현재 로그인 유저 본인은 팔로우 버튼을 숨긴다', () => {
    render(<FollowListClient list={mockList} title="팔로워" />)
    // me 유저 아이템 렌더링은 되지만 버튼은 없음
    expect(screen.getByText('me')).toBeInTheDocument()
    const buttons = screen.getAllByRole('button')
    // alice 팔로우 + bob 팔로잉 = 2개. me 버튼 없음.
    expect(buttons).toHaveLength(2)
  })

  it('bio가 있으면 표시한다', () => {
    render(<FollowListClient list={mockList} title="팔로워" />)
    expect(screen.getByText('안녕')).toBeInTheDocument()
  })

  it('목록이 비어있으면 빈 상태 메시지를 표시한다', () => {
    render(<FollowListClient list={[]} title="팔로워" />)
    expect(screen.getByText('아직 없어요')).toBeInTheDocument()
  })
})
