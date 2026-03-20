"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GuidePost, PostItem } from "../../../type/posts";
import { postList } from "../api/post";
import { useAuthGuard } from "../hooks/useAuthGuard";

const Tabs = [
  { key: "all", label: "전체" },
  { key: "mustEat", label: "맛집" },
  { key: "accommodation", label: "숙소" },
  { key: "photoSpot", label: "포토스팟" },
  { key: "shopping", label: "쇼핑" },
  { key: "transport", label: "교통" },
  { key: "tips", label: "꿀팁" },
];
const COUNTRIES = ["전체", "일본", "캐나다", "미국", "유럽", "동남아", "기타"];
const PRESET_COUNTRIES = ["일본", "캐나다", "미국", "유럽", "동남아"];

export default function TravelGuidePage() {
  useAuthGuard();
  const router = useRouter();
  const [tap, newTap] = useState("all");
  const [country, setCountry] = useState("전체");
  const [posts, setPosts] = useState<GuidePost[]>([]);

  const filtered = posts.filter((post) => {
    const matchTab = tap === "all" || post.guide.category === tap;
    const matchCountry =
      country === "전체" ||
      (country === "기타"
        ? !PRESET_COUNTRIES.includes(post.guide.country)
        : post.guide.country === country);
    return matchTab && matchCountry;
  });

  useEffect(() => {
    postList("", 1, "guide").then((result) => {
      if (result.status === 200) {
        const guideItems = result.data.item.map((post: PostItem) => {
          try {
            const parseData = JSON.parse(post.content);
            const guidePost = { ...post, guide: parseData };
            return guidePost;
          } catch {
            return null;
          }
        });
        const filteredItems = guideItems.filter((post: GuidePost | null) => {
          return post !== null;
        });
        setPosts(filteredItems);
      }
    });
  }, []);
  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1>여행팁</h1>
        <button
          onClick={() => router.push("/travel-guide/new")}
          className="text-xs px-3 py-1.5 rounded-full border border-gray-300"
        >
          + 작성하기
        </button>
      </div>
      {/* 나라 필터 */}
      <div
        className="flex gap-2 overflow-x-auto pb-2 mb-3 "
        style={{ scrollbarWidth: "none" }}
      >
        {COUNTRIES.map((eachCountry) => (
          <button
            key={eachCountry}
            onClick={() => setCountry(eachCountry)}
            className={`shrink-0 text-xs px-3 py-1 rounded-full border ${
              country === eachCountry
                ? "bg-gray-800 text-white"
                : "border-gray-200 text-gray-500"
            }`}
          >
            {eachCountry}
          </button>
        ))}
      </div>
      {/* 카테고리 탭 */}
      <div className="flex border-b mb-5">
        {Tabs.map((eachTap) => (
          <button
            key={eachTap.key}
            onClick={() => newTap(eachTap.key)}
            className={`px-3 pb-2 text-xs font-medium border-b-2 -mb-px ${tap === eachTap.key ? "border-gray-800 text-gray-800" : "border-transparent text-gray-400"}`}
          >
            {eachTap.label}
          </button>
        ))}
      </div>
      {/* 목록 */}
      <div className="flex flex-col">
        {filtered.map((post) => (
          <div
            key={post._id}
            className="flex items-start gap-3 py-4 border-b border-gray-100"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{post.title}</p>
                {country === "기타" && post.guide.country && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">
                    {post.guide.country}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{post.guide.desc}</p>
              <p className="text-xs text-gray-400 mt-1">{post.guide.subDesc}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
