"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { postList } from "../api/post";
import { PostItem, GuidePost } from "../../../type/posts";

const QUICK_MENU = [
  { label: "게시글", href: "/post" },
  { label: "여행팁", href: "/travel-guide" },
  { label: "일정", href: "/itinerary" },
  { label: "체크리스트", href: "/checklist" },
  { label: "환율", href: "/currency" },
  { label: "여행준비", href: "/weather-prep" },
];

export default function MainPage() {
  useAuthGuard();

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [guides, setGuides] = useState<GuidePost[]>([]);

  useEffect(() => {
    postList("", 1, "post").then((res) => {
      if (res.status === 200) setPosts(res.data.item?.slice(0, 5) ?? []);
    });
    postList("", 1, "guide").then((res) => {
      if (res.status === 200) {
        const items = res.data.item
          ?.map((post: PostItem) => {
            try {
              return { ...post, guide: JSON.parse(post.content) };
            } catch {
              return null;
            }
          })
          .filter(Boolean)
          .slice(0, 5);
        setGuides(items ?? []);
      }
    });
  }, []);

  return (
    <main className="max-w-xl mx-auto flex flex-col pb-16 px-4">

      {/* 빠른 메뉴 */}
      <section className="mt-5 flex gap-2 flex-wrap">
        {QUICK_MENU.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className="px-4 py-1.5 rounded-full border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition"
          >
            {menu.label}
          </Link>
        ))}
      </section>

      {/* 구분선 */}
      <hr className="mt-5 border-gray-100" />

      {/* 최근 게시글 */}
      <section className="mt-7">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-900">최근 게시글</h2>
          <Link href="/post" className="text-xs text-gray-400 hover:text-gray-700 transition">
            더보기
          </Link>
        </div>
        <div className="flex flex-col divide-y divide-gray-100">
          {posts.length === 0 ? (
            <p className="text-sm text-gray-300 py-8 text-center">게시글이 없어요</p>
          ) : (
            posts.map((post) => (
              <Link
                key={post._id}
                href={`/post/${post._id}`}
                className="py-3.5 flex justify-between items-center gap-4 hover:opacity-60 transition"
              >
                <p className="text-sm text-gray-800 font-medium line-clamp-1">{post.title}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400">{post.user.name}</span>
                  <span className="text-xs text-gray-300">{post.createdAt?.slice(0, 10)}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* 구분선 */}
      <hr className="mt-7 border-gray-100" />

      {/* 인기 여행팁 */}
      <section className="mt-7">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-900">인기 여행팁</h2>
          <Link href="/travel-guide" className="text-xs text-gray-400 hover:text-gray-700 transition">
            더보기
          </Link>
        </div>
        <div className="flex flex-col divide-y divide-gray-100">
          {guides.length === 0 ? (
            <p className="text-sm text-gray-300 py-8 text-center">여행팁이 없어요</p>
          ) : (
            guides.map((guide) => (
              <div key={guide._id} className="py-3.5 flex justify-between items-center gap-4">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-sm text-gray-800 font-medium line-clamp-1">{guide.title}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{guide.guide?.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400">{guide.user.name}</span>
                  <span className="text-xs text-gray-300">{guide.createdAt?.slice(0, 10)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </main>
  );
}
