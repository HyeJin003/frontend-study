"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { postRegist, uploadImage } from "../../api/post";
import { uploadFile } from "../../api/user";
import { useAuthGuard } from "../../hooks/useAuthGuard";

const CATEGORIES = [
  { key: "mustEat", label: "맛집" },
  { key: "accommodation", label: "숙소" },
  { key: "photoSpot", label: "포토스팟" },
  { key: "shopping", label: "쇼핑" },
  { key: "transport", label: "교통" },
  { key: "tips", label: "꿀팁" },
];

const PRESET_COUNTRIES = ["일본", "캐나다", "미국", "유럽", "동남아", "기타"];

export default function TravelGuideNewPage() {
  useAuthGuard();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    country: "",
    customCountry: "",
    category: "",
    title: "",
    desc: "",
    subDesc: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isCustom = form.country === "직접입력";
  const finalCountry = isCustom ? form.customCountry : form.country;

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!finalCountry || !form.category || !form.title || !form.desc) {
      setError("나라, 카테고리, 이름, 설명은 필수입니다.");
      return;
    }

    setSubmitting(true);

    let imagePath = "";
    if (imageFile) {
      setUploading(true);
      const uploadRes = await uploadFile(imageFile);
      setUploading(false);
      if (uploadRes?.ok) {
        imagePath = uploadRes.item.path ?? uploadRes.item.name ?? "";
      }
    }

    const content = JSON.stringify({
      desc: form.desc,
      country: finalCountry,
      category: form.category,
      image: imagePath,
      subDesc: form.subDesc,
    });

    const res = await postRegist({
      type: "guide",
      title: form.title,
      content,
      tag: "",
    });

    setSubmitting(false);
    if (res?.status === 200 || res?.status === 201) {
      router.push("/travel-guide");
    } else {
      setError("저장에 실패했어요. 로그인 상태를 확인해주세요.");
    }
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      {/* 상단 */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          ←
        </button>
        <h1 className="text-lg font-bold">여행 정보 올리기</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* 사진 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사진
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {imagePreview ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
              <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(""); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white text-xs flex items-center justify-center hover:bg-black/70"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-400 transition-colors"
            >
              <span className="text-3xl">📷</span>
              <span className="text-sm">사진 추가</span>
              <span className="text-xs text-gray-300">탭해서 갤러리에서 선택</span>
            </button>
          )}
        </div>

        {/* 나라 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            나라
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {PRESET_COUNTRIES.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => set("country", c)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  form.country === c
                    ? "bg-gray-800 text-white border-gray-800"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                {c}
              </button>
            ))}
            <button
              type="button"
              onClick={() => set("country", "직접입력")}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                isCustom
                  ? "bg-gray-800 text-white border-gray-800"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              직접입력
            </button>
          </div>
          {isCustom && (
            <input
              type="text"
              placeholder="나라 이름 입력"
              value={form.customCountry}
              onChange={(e) => set("customCountry", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          )}
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.key}
                onClick={() => set("category", c.key)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  form.category === c.key
                    ? "bg-gray-800 text-white border-gray-800"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 이름 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이름 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="예: 이치란 라멘"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* 설명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            한줄 설명 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="예: 개인 칸막이에서 즐기는 진한 돼지뼈 국물"
            value={form.desc}
            onChange={(e) => set("desc", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* 구매처 / 위치 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            구매처 / 위치
          </label>
          <input
            type="text"
            placeholder="예: 전국 체인점 / 돈키호테 / 아사쿠사"
            value={form.subDesc}
            onChange={(e) => set("subDesc", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full py-3 rounded-lg bg-gray-800 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {uploading ? "사진 업로드 중..." : submitting ? "저장 중..." : "올리기"}
        </button>
      </form>
    </main>
  );
}
