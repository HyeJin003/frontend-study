"use client";

import { useEffect, useRef, useState } from "react";
import {
  getProfile,
  updateProfile,
  uploadFile,
  deleteAccount,
} from "../../api/user";
import { useAuthGuard } from "../../hooks/useAuthGuard";

export default function ProfilePage() {
  useAuthGuard();
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId"));
    getProfile(userId).then((result) => {
      if (result.ok) {
        setName(result.item.name);
        setBio(result.item.extra?.bio || "");
        if (result.item.image) {
          setPreview(result.item.image);
        }
      }
    });
  }, []);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  function handleImageRemove() {
    setPreview(null);
    setImageFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDeleteAccount() {
    if (!confirm("정말 탈퇴하시겠습니까?\n탈퇴 후 데이터는 복구되지 않습니다."))
      return;
    const userId = Number(localStorage.getItem("userId"));
    const result = await deleteAccount(userId);
    if (result.ok) {
      localStorage.removeItem("userId");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      alert("탈퇴가 완료되었습니다.");
      window.location.href = "/";
    } else {
      alert(result.message || "탈퇴에 실패했습니다.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const userId = Number(localStorage.getItem("userId"));
    const data: {
      name?: string;
      password?: string;
      image?: string;
      extra?: { bio?: string };
    } = {};
    if (name.trim() !== "") data.name = name;
    if (newPassword.trim() !== "") data.password = newPassword;
    if (bio.trim() !== "") data.extra = { bio };

    if (imageFile) {
      const fileResult = await uploadFile(imageFile);
      if (fileResult.ok) {
        data.image = fileResult.item[0].path;
      }
    }

    const updateResult = await updateProfile(userId, data);
    if (updateResult.ok) {
      alert("프로필이 수정되었습니다.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">

      <div className="w-full max-w-sm mx-auto px-6 py-8 flex flex-col gap-6">
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-700 shadow-md cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-black dark:bg-white rounded-full flex items-center justify-center shadow text-white dark:text-black text-sm"
            >
              ✎
            </button>
          </div>
          {preview && (
            <button
              type="button"
              onClick={handleImageRemove}
              className="text-xs text-gray-400 dark:text-zinc-500 underline"
            >
              이미지 제거
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* 폼 카드 */}
        <form
          id="profile-form"
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden"
        >
          {/* 이름 */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
            <label className="block text-xs font-medium text-gray-400 dark:text-zinc-500 mb-1">
              이름
            </label>
            <input
              type="text"
              placeholder="변경할 이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm text-gray-900 dark:text-white bg-transparent placeholder-gray-300 dark:placeholder-zinc-600 outline-none"
            />
          </div>

          {/* 자기소개 */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
            <label className="block text-xs font-medium text-gray-400 dark:text-zinc-500 mb-1">
              자기소개
            </label>
            <textarea
              placeholder="자기소개를 입력하세요"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full text-sm text-gray-900 dark:text-white bg-transparent placeholder-gray-300 dark:placeholder-zinc-600 outline-none resize-none"
            />
          </div>

          {/* 비밀번호 */}
          <div className="px-5 py-4">
            <label className="block text-xs font-medium text-gray-400 dark:text-zinc-500 mb-1">
              새 비밀번호
            </label>
            <input
              type="password"
              placeholder="변경할 비밀번호를 입력하세요"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full text-sm text-gray-900 dark:text-white bg-transparent placeholder-gray-300 dark:placeholder-zinc-600 outline-none"
            />
          </div>
        </form>

        {/* 저장 버튼 */}
        <button
          type="submit"
          form="profile-form"
          className="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-2xl text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
        >
          수정하기
        </button>

        {/* 구분선 */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
          <span className="text-xs text-gray-300 dark:text-zinc-600">설정</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
        </div>

        {/* 탈퇴 영역 */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-red-100 dark:border-red-900/30 overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-500">회원 탈퇴</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                탈퇴 후 데이터는 복구되지 않습니다
              </p>
            </div>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
