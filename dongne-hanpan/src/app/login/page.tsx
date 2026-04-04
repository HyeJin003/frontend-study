"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import HapticButton from "@/components/ui/HapticButton";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [errorMsg, setErrorMsg] = useState("");

  // ── GPS → 동네 이름 (Kakao 역지오코딩)
  const resolveNeighborhood = (): Promise<string | undefined> =>
    new Promise((resolve) => {
      if (typeof window === "undefined" || !navigator.geolocation) return resolve(undefined);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          if (!window.kakao?.maps?.services) return resolve(undefined);
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2RegionCode(lng, lat, (result: Array<{ region_type: string; region_3depth_name: string }>, status: string) => {
            if (status === "OK") {
              const dong = result.find((r) => r.region_type === "H");
              resolve(dong?.region_3depth_name);
            } else {
              resolve(undefined);
            }
          });
        },
        () => resolve(undefined),
        { timeout: 5000 },
      );
    });

  // ── 로그인
  const { mutate: doLogin, isPending: isLogging } = useMutation({
    mutationFn: () => authService.login(form.email, form.password),
    onSuccess: async ({ user, token }) => {
      const neighborhood = await resolveNeighborhood();
      login(user as never, token, neighborhood);
      router.replace("/");
    },
    onError: () => setErrorMsg("아이디 또는 비밀번호가 틀렸어요."),
  });

  // ── 회원가입
  const { mutate: doSignup, isPending: isSigningUp } = useMutation({
    mutationFn: () => authService.signup(form.email, form.password, form.name),
    onSuccess: () => {
      setMode("login");
      setErrorMsg("");
    },
    onError: () => setErrorMsg("이미 사용 중인 이메일이거나 오류가 발생했어요."),
  });

  const isPending = isLogging || isSigningUp;
  const canSubmit = form.email.trim() && form.password.trim() &&
    (mode === "login" || form.name.trim()) && !isPending;

  const handleSubmit = () => {
    setErrorMsg("");
    if (mode === "login") doLogin();
    else doSignup();
  };

  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-5">
      {/* 로고 */}
      <motion.div
        className="flex flex-col items-center gap-3 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center shadow-2xl shadow-brand/40">
          <span className="text-white font-black text-3xl">동</span>
        </div>
        <h1 className="text-white font-black text-2xl tracking-tight">동네한판</h1>
        <p className="text-white/40 text-sm text-center">
          동네에서 뛰고 땅을 차지해요
        </p>
      </motion.div>

      {/* 탭 */}
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex bg-neutral-900 rounded-2xl p-1 mb-5 border border-white/5">
          {(["login", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setErrorMsg(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === m ? "bg-brand text-white shadow-md" : "text-white/40"
              }`}
            >
              {m === "login" ? "로그인" : "회원가입"}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {mode === "signup" && (
              <motion.input
                key="name"
                type="text"
                placeholder="닉네임"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/20 outline-none focus:border-brand/60"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              />
            )}
          </AnimatePresence>

          <input
            type="email"
            placeholder="이메일"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/20 outline-none focus:border-brand/60"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && canSubmit && handleSubmit()}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/20 outline-none focus:border-brand/60"
          />

          {/* 에러 */}
          <AnimatePresence>
            {errorMsg && (
              <motion.p
                className="text-red-400 text-xs px-1"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>

          <HapticButton
            haptic="success"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-2xl font-black text-base mt-2 ${
              canSubmit ? "bg-brand text-white shadow-xl shadow-brand/30" : "bg-neutral-800 text-white/20"
            }`}
          >
            {isPending ? "처리 중..." : mode === "login" ? "로그인" : "가입하기"}
          </HapticButton>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          로그인하면 동네에 자동 배정돼요 🏘️
        </p>
      </motion.div>
    </main>
  );
}
