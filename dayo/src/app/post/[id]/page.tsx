"use client";
import DOMPurify from "isomorphic-dompurify";
import {
  postDetail,
  deletePost,
  addLike,
  removeLike,
  getLikes,
  getBookmarks,
} from "../../api/post";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostItem, BookmarkItem } from "../../../../type/posts";
import Comments from "../../components/Comments";
import UserProfile from "@/app/components/UserProfile";

export default function PostDetailPage() {
  const [likeLoading, setLikeLoading] = useState(false);
  const [like, setLike] = useState(false);
  const [likeId, setLikeId] = useState<number | null>(null);
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
      await removeLike(likeId!);
      setLike(false);
      setLikeId(null);
      setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      const result = await addLike(post._id);
      if (result.ok) {
        setLike(true);
        setLikeId(result.item._id);
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
      setLikeCount(result.data.item.likes ?? 0);
    });

    getBookmarks().then((bookmarks) => {
      const myBookmark = bookmarks.item?.find(
        (bookmark: BookmarkItem) => bookmark.post._id === Number(id),
      );
      if (myBookmark) {
        setBookmarkId(myBookmark._id);
      }
    });

    getLikes().then((likes) => {
      const myLike = likes.item?.find(
        (likeItem: BookmarkItem) => likeItem.post._id === Number(id),
      );
      if (myLike) {
        setLike(true);
        setLikeId(myLike._id);
      }
    });
  }, [id]);

  if (!post) return <p>로딩중...</p>;
  const isMyPost = myId === post.user._id;
  return (
    <main className="max-w-2xl mx-auto p-6">
      {isMyPost && (
        <div className="flex gap-3 text-sm justify-end">
          <button onClick={() => router.push(`/post/edit/${id}`)}>수정</button>
          <button onClick={handleDelete} className="text-red-400">
            삭제
          </button>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <UserProfile name={post.user.name} image={post.user.image} />
      <div
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
      />
      <div className="flex gap-4 mt-6">
        <button onClick={handleLike} disabled={likeLoading}>
          {like ? "♥" : "♡"} {likeCount}
        </button>
      </div>
      <Comments postId={Number(post._id)} />
    </main>
  );
}
