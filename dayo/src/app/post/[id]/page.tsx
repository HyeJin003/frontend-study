import { postDetail } from "../../../../api/post";
import { Props } from "../../../../type/posts";

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await postDetail(id);
  const post = result.data.item;
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{post.user.name}</p>
      <div className="text-sm leading-relaxed">{post.content}</div>
    </main>
  );
}
