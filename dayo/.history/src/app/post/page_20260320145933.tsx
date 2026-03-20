import Link from "next/link";
import { postList } from "../api/post";
import { PostItem } from "../../../type/posts";
import UserProfile from "../components/UserProfile";
import { useRef, useCallback } from "react";
export const dynamic = "force-dynamic";

export default async function PostListPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string }>;
}) {
  const { keyword = "" } = await searchParams;
  const result = await postList(keyword);
  const posts = result.data.item ?? [];

  return (
    <div>
      <main className="flex flex-col gap-4 p-6 max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">게시글</h1>
          <Link
            href="/post/new"
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm"
          >
            글쓰기
          </Link>
        </div>
        {posts.map((post: PostItem) => (
          <Link
            key={post._id}
            href={`/post/${post._id}`}
            className="flex flex-col gap-2 border-b pb-4"
          >
            <h2 className="font-bold text-lg">{post.title}</h2>
            <UserProfile name={post.user.name} image={post.user.image} />
            <div className="flex justify-between items-center">
              {/* <p className="text-sm text-gray-500">{post.user.name}</p> */}
              <time className="text-xs text-gray-400">{post.createdAt}</time>
              <span className="text-xs text-gray-400">♥ {post.likes ?? 0}</span>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
