"use client";

import { useState, useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { communityService } from "@/services/communityService";
import HapticButton from "@/components/ui/HapticButton";
import SuccessCelebration from "@/components/ui/SuccessCelebration";
import type { UploadedFile } from "@/types";

const SPORT_OPTIONS = ["축구", "농구", "배드민턴", "테니스", "러닝", "헬스", "기타"];

export default function CommunityPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sport, setSport] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── 파일 업로드 뮤테이션 ────────────────────────────────────────
  const { mutate: uploadFile, isPending: isUploading } = useMutation({
    mutationFn: (files: File[]) => communityService.uploadFiles(files),
    onSuccess: (files) => setUploadedFiles(files),
  });

  // ── 게시글 등록 뮤테이션 ────────────────────────────────────────
  const { mutate: submit, isPending: isSubmitting } = useMutation({
    mutationFn: () =>
      communityService.createPost({
        title,
        content,
        images: uploadedFiles,
        extra: { sport },
      }),
    onSuccess: () => {
      setShowSuccess(true);
    },
  });

  // ── 파일 선택 핸들러 ────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    uploadFile([file]);
  }, [uploadFile]);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // ── 드래그 앤 드롭 ─────────────────────────────────────────────
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const canSubmit =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    !isSubmitting &&
    !isUploading;

  // 성공 후 폼 초기화
  const handleCelebrationDone = () => {
    setShowSuccess(false);
    setTitle("");
    setContent("");
    setSport("");
    setPreviewUrl(null);
    setUploadedFiles([]);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white pb-16">
      {/* ── 헤더 ────────────────────────────────────────────────── */}
      <motion.div
        className="sticky top-0 z-20 bg-neutral-950/90 backdrop-blur-md border-b border-white/5 px-4 py-4"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-black text-xl">🏅 운동 인증</h1>
        <p className="text-white/40 text-xs mt-0.5">
          오늘 뭐 입고 뛰었어요? 보여주세요!
        </p>
      </motion.div>

      <div className="px-4 pt-5 space-y-5">
        {/* ── 사진 업로드 영역 ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className={`relative rounded-2xl border-2 border-dashed transition-colors overflow-hidden cursor-pointer ${
              isDragging
                ? "border-brand bg-brand/10"
                : "border-white/15 bg-neutral-900"
            }`}
            style={{ aspectRatio: "4/3" }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileInputChange}
            />

            <AnimatePresence mode="wait">
              {previewUrl ? (
                <motion.div
                  key="preview"
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="인증샷 미리보기"
                    className="w-full h-full object-cover"
                  />
                  {/* 업로드 중 오버레이 */}
                  <AnimatePresence>
                    {isUploading && (
                      <motion.div
                        className="absolute inset-0 bg-black/60 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* 재선택 버튼 */}
                  <div className="absolute bottom-3 right-3">
                    <HapticButton
                      haptic="light"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-white/20"
                    >
                      사진 바꾸기
                    </HapticButton>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center text-2xl"
                    animate={isDragging ? { scale: 1.15 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    📸
                  </motion.div>
                  <div className="text-center">
                    <p className="text-white/60 text-sm font-semibold">
                      인증샷을 올려주세요
                    </p>
                    <p className="text-white/30 text-xs mt-1">
                      클릭하거나 드래그 앤 드롭
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── 종목 선택 ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">
            종목
          </label>
          <div className="flex flex-wrap gap-2">
            {SPORT_OPTIONS.map((s) => (
              <HapticButton
                key={s}
                haptic="light"
                onClick={() => setSport(s)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  sport === s
                    ? "bg-brand border-brand text-white shadow-lg shadow-brand/30"
                    : "bg-neutral-900 border-white/10 text-white/60"
                }`}
              >
                {s}
              </HapticButton>
            ))}
          </div>
        </motion.div>

        {/* ── 제목 입력 ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="오늘의 운동 한 줄 요약"
            maxLength={50}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-brand/60 transition-colors"
          />
        </motion.div>

        {/* ── 내용 입력 ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 무엇을 입고, 어디서, 어떻게 뛰었나요?"
            rows={4}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-brand/60 transition-colors resize-none"
          />
          <p className="text-right text-white/20 text-xs mt-1">
            {content.length}자
          </p>
        </motion.div>

        {/* ── 등록 버튼 ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <HapticButton
            haptic="success"
            disabled={!canSubmit}
            onClick={() => submit()}
            className={`w-full py-4 rounded-2xl font-black text-base transition-all ${
              canSubmit
                ? "bg-brand text-white shadow-xl shadow-brand/30"
                : "bg-neutral-800 text-white/20 cursor-not-allowed"
            }`}
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="loading"
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                  />
                  등록 중...
                </motion.div>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  🏅 인증 등록하기
                </motion.span>
              )}
            </AnimatePresence>
          </HapticButton>
        </motion.div>
      </div>

      {/* ── 성공 축하 오버레이 ──────────────────────────────────── */}
      <SuccessCelebration
        show={showSuccess}
        title="인증 완료! 🎉"
        subtitle="오늘도 멋지게 뛰었네요!"
        onDone={handleCelebrationDone}
      />
    </main>
  );
}
