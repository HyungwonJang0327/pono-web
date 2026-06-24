import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@clerk/nextjs/server'
import type { Metadata } from 'next'
import { getPostDetail } from '@/services/post.service'
import type { PostDetailDto } from '@/types/post'
import SnapDetailPage from './SnapDetailPage'
import ArticleDetailPage from './ArticleDetailPage'

interface PageProps {
  params: Promise<{ username: string; postId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { postId } = await params
  try {
    const post = await getPostDetail(postId)
    if (post.type !== 'article') return {}
    return {
      title: post.title,
      description: post.body
        ? String(post.title)
        : undefined,
      openGraph: {
        title: post.title,
        ...(post.coverImage ? { images: [post.coverImage] } : {}),
      },
    }
  } catch {
    return {}
  }
}

export default async function PostDetailPage({ params }: PageProps) {
  const { postId } = await params
  const { getToken } = await auth()
  const token = await getToken()

  let post: PostDetailDto
  try {
    post = await getPostDetail(postId, token ?? undefined)
  } catch (err) {
    const status = (err as { status?: number }).status
    if (status === 404) notFound()
    throw err
  }

  const headersList = await headers()
  const isWebView = headersList.get('x-is-webview') === 'true'

  if (post.type === 'snap') {
    return <SnapDetailPage post={post} isWebView={isWebView} />
  }
  return <ArticleDetailPage post={post} isWebView={isWebView} />
}
