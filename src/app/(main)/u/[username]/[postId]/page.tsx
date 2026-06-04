export default function PostDetailPage({ params }: { params: { username: string; postId: string } }) {
  return <div>Post: {params.postId}</div>
}
