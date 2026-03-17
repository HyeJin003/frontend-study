"use client";
import DOMPurify from "isomorphic-dompurify";

import {
  postDetail,
  deletePost,
  addBookmark,
  removeBookmark,
} from "../../../../api/post";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostItem } from "../../../../type/posts";
import { getBookmarks } from "../../../../api/post";
import Comments from "../../components/Comments";

export default function PostDetailPage() {
  const [likeLoading, setLikeLoading] = useState(false);
  const [like, setLike] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<number | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<PostItem | null>(null);
  const [myId, setMyId] = useState<number | null>(null);

  async function handleLike() {
    if (!post || likeLoading) return;
    setLikeLoading(true);
    if (like) {
      await removeBookmark(bookmarkId!);
      setLike(false);
      setBookmarkId(null);
      setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      const result = await addBookmark(post._id);
      if (result.ok) {
        setLike(true);
        setBookmarkId(result.item._id);
        setLikeCount((prev) => prev + 1);
      }
    }
    setLikeLoading(false);
  }
  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const result = await deletePost(Number(id));
    if (result.ok) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.href = "/post";
    }
  }
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      router.replace("/customer/login");
      return;
    }
    setMyId(Number(localStorage.getItem("userId")));
    postDetail(id as string).then((result) => {
      setPost(result.data.item);
      setLikeCount(result.data.item.like ?? 0);
    });
    getBookmarks().then((bookmarks) => {
      const myBookmark = bookmarks.item?.find(
        (b: any) => b.post._id === Number(id),
      );
      if (myBookmark) {
        setLike(true);
        setBookmarkId(myBookmark._id);
      }
    });
  }, [id]);

  if (!post) return <p>로딩중...</p>;
  const isMyPost = myId === post.user._id;
  return (
    <main className="max-w-2xl mx-auto p-6">
      {/* 수정/삭제 버튼 추가 */}
      {/* {isMyPost && ( */}
      <div className="flex gap-3 text-sm justify-end">
        <button onClick={() => router.push(`/post/edit/${id}`)}>수정</button>
        <button onClick={handleDelete} className="text-red-500">
          삭제
        </button>
      </div>
      {/* )} */}
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{post.user.name}</p>
      <div
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
      />
      <div className="flex gap-4 mt-6">
        <button onClick={handleLike} disabled={likeLoading}>
          {like ? "♥" : "♡"}
          {likeCount}
        </button>
      </div>
      {/* 댓글 추가 */} <Comments postId={post._id} />
    </main>
  );
}
