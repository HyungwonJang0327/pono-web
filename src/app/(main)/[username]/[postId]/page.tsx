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

/** TipTap JSON에서 텍스트만 추출해 150자 절삭 */
function extractExcerpt(node: { type?: string; content?: unknown[]; text?: string } | unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { type?: string; content?: unknown[]; text?: string }
  if (n.type === 'text') return n.text ?? ''
  if (!Array.isArray(n.content)) return ''
  const text = n.content.map(extractExcerpt).join('')
  return text.length > 150 ? text.slice(0, 150) + '...' : text
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { postId } = await params
  try {
    const post = await getPostDetail(postId)
    if (post.type !== 'article') return {}
    const description = extractExcerpt(post.body) || undefined
    return {
      title: post.title,
      description,
      openGraph: {
        title: post.title,
        description,
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
