"use client";

import { useState, useEffect } from "react";
import { getMe, updateMe, changePassword, deleteMe, logout } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";


type Member = {
  id: number;
  email: string;
  nickname: string;
  provider: string;
  createdAt: string;
};

export default function MyPage() {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { clearAuth, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;
    let isMounted = true;
    getMe()
      .then((result) => {
        if (!isMounted) return;
        setMember(result.data);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        router.push("/auth/login");
      });
    return () => { isMounted = false };
  }, [_hasHydrated]);

  const handleUpdate = async () => {
    try {
      await updateMe({ nickname });
      setMember((prev) => (prev ? { ...prev, nickname } : prev));
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "실패했습니다.");
    }
  };

  const handleChangePassword = async () => {
    if (confirmNewPassword !== newPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword: confirmNewPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "실패했습니다.");
    }
  };

  const handleDeleteMe = async () => {
    if (!window.confirm("정말 탈퇴 하실건가요?")) return;
    try {
      await deleteMe();
      clearAuth();
      router.push("/");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "실패했습니다.");
    }
  };

 
  const handleLogout = async () => {
      if (!window.confirm("로그아웃 하실 건가여??")) return;
    try {
      await logout();
    } catch {
      // 서버 실패해도 프론트는 무조건 클리어
    }
    clearAuth();
    router.push("/");
  }
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="flex flex-col  gap-6 w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm">
      {isLoading ? (
        <p>로딩중 ....</p>
      ) : isEditing ? (
        <div className="flex flex-col gap-3">
          <p>이메일: {member?.email}</p>
          <label>
            닉네임:
            <input
              defaultValue={member?.nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임" className="w-full border borer-border rounded-md px-3 py-2 text-sm outline-none focus:rin-2 focus:ring-violet-400/50"
            />
          </label>
          <label>
            현재 비밀번호:
            <input type="password" onChange={(e) => setCurrentPassword(e.target.value)} className="w-full border borer-border rounded-md px-3 py-2 text-sm outline-none focus:rin-2 focus:ring-violet-400/50"/>
          </label>
          <label>
            새 비밀번호:
            <input type="password" onChange={(e) => setNewPassword(e.target.value)} className="w-full border borer-border rounded-md px-3 py-2 text-sm outline-none focus:rin-2 focus:ring-violet-400/50"/>
          </label>
          <label>
            새 비밀번호 확인:
            <input type="password" onChange={(e) => setConfirmNewPassword(e.target.value)} className="w-full border borer-border rounded-md px-3 py-2 text-sm outline-none focus:rin-2 focus:ring-violet-400/50"/>
          </label>
          {errorMessage && <p>{errorMessage}</p>}
          <Button onClick={() => setIsEditing(false)}>취소</Button>
          <Button onClick={handleUpdate}>닉네임 저장</Button>
          <Button onClick={handleChangePassword}>비밀번호 변경</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">이메일</span>
      <span className="text-sm">{member?.email}</span>
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">닉네임</span>
      <span className="text-sm">{member?.nickname}</span>
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">비밀번호</span>
      <span className="text-sm">●●●●●●●●</span>
    </div>
                <div className="flex gap-2">
          <Button size="lg" onClick={() => setIsEditing(true)} className="flex-1">편집</Button>
              <Button size="lg" onClick={handleDeleteMe} className="flex-1" >회원탈퇴</Button>
                  <Button size="lg" onClick={handleLogout} className="flex-1">로그아웃</Button>
                  </div>
        </div>
      )}
      </div>
      </div>
  );
}
