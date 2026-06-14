export default async function PostDetailPage({ params }: { params: Promise<{ username: string; postId: string }> }) {
  const { postId } = await params
  return <div>Post: {postId}</div>
}
