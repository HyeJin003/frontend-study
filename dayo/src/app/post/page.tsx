import Link from "next/link";
import { postList } from "../../../api/post";
import { PostItem } from "../../../type/posts";

export default async function PostListPage() {
  const result = await postList();
  const posts = result.data.item;
  return (
    <div>
      <main className="flex flex-col gap-4 p-6 max-w-2xl mx-auto w-full">
        {posts.map((post: PostItem) => (
          <Link
            key={post._id}
            href={`/post/${post._id}`}
            className="flex flex-col gap-2 border-b pb-4"
          >
            <h2 className="font-bold text-lg">{post.title}</h2>
            <p className="text-sm text-gray-500">{post.user.name}</p>
            <time className="text-xs text-gray-400">{post.createdAt}</time>
          </Link>
        ))}
      </main>
    </div>
  );
}
