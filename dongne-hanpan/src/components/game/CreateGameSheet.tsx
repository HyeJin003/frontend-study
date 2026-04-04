"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HapticButton from "@/components/ui/HapticButton";
import type { LatLng } from "@/hooks/useMap";

interface KakaoPlace {
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string; // lng
  y: string; // lat
}

function usePlaceSearch() {
  const [results, setResults] = useState<KakaoPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = (keyword: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!keyword.trim()) { setResults([]); return; }

    timerRef.current = setTimeout(() => {
      const kakao = (window as unknown as { kakao?: { maps?: { services?: { Places: new () => { keywordSearch: (kw: string, cb: (r: KakaoPlace[], s: string) => void) => void } } } } }).kakao;
      if (!kakao?.maps?.services) return;
      setIsSearching(true);
      const ps = new kakao.maps.services.Places();
      ps.keywordSearch(keyword, (data: KakaoPlace[], status: string) => {
        setIsSearching(false);
        if (status === "OK") setResults(data.slice(0, 5));
        else setResults([]);
      });
    }, 400);
  };

  const clear = () => setResults([]);
  return { results, isSearching, search, clear };
}

const SPORTS = ["축구", "농구", "배드민턴", "테니스", "러닝", "헬스", "기타"];
const SPORT_EMOJI: Record<string, string> = {
  축구: "⚽", 농구: "🏀", 배드민턴: "🏸", 테니스: "🎾",
  러닝: "🏃", 헬스: "💪", 기타: "🏅",
};

export interface CreateGameForm {
  title: string;
  content: string;
  sport: string;
  location: string;
  date: string;
  maxPlayers: number;
  lat: number;
  lng: number;
}

interface CreateGameSheetProps {
  show: boolean;
  currentPosition: LatLng;
  onClose: () => void;
  onSubmit: (form: CreateGameForm) => void;
  isPending: boolean;
}

export default function CreateGameSheet({
  show, currentPosition, onClose, onSubmit, isPending,
}: CreateGameSheetProps) {
  const [form, setForm] = useState<CreateGameForm>({
    title: "", content: "", sport: "축구", location: "",
    date: "", maxPlayers: 6,
    lat: currentPosition.lat, lng: currentPosition.lng,
  });
  const [locationQuery, setLocationQuery] = useState("");
  const [locationPicked, setLocationPicked] = useState(false);
  const { results, isSearching, search, clear } = usePlaceSearch();

  const canSubmit = form.title.trim() && form.location.trim() && !isPending;

  const handleSubmit = () => {
    onSubmit({ ...form });
  };

  const handleLocationChange = (val: string) => {
    setLocationQuery(val);
    setLocationPicked(false);
    search(val);
  };

  const handlePickPlace = (place: KakaoPlace) => {
    setForm((f) => ({
      ...f,
      location: place.place_name,
      lat: parseFloat(place.y),
      lng: parseFloat(place.x),
    }));
    setLocationQuery(place.place_name);
    setLocationPicked(true);
    clear();
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900 rounded-t-3xl border-t border-white/10 max-h-[88vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="px-5 pb-10 space-y-5 pt-3">
              {/* 헤더 */}
              <div>
                <h2 className="font-black text-xl">⚡ 여기서 게임 열기</h2>
                <p className="text-white/40 text-xs mt-1">
                  내 현재 위치에 게임 핀이 꽂혀요
                </p>
              </div>

              {/* 위치 미리보기 */}
              <div className="bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-white/60 text-xs font-bold">
                    {locationPicked ? form.location : "현재 내 위치 (장소 검색으로 변경 가능)"}
                  </p>
                  <p className="text-white/30 text-xs mt-0.5">
                    {form.lat.toFixed(5)}, {form.lng.toFixed(5)}
                  </p>
                </div>
              </div>

              {/* 종목 */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">종목</label>
                <div className="flex flex-wrap gap-2">
                  {SPORTS.map((s) => (
                    <HapticButton
                      key={s}
                      haptic="light"
                      onClick={() => setForm((f) => ({ ...f, sport: s }))}
                      className={`px-3 py-2 rounded-full text-sm font-bold border transition-colors ${
                        form.sport === s
                          ? "bg-brand border-brand text-white"
                          : "bg-neutral-800 border-white/10 text-white/50"
                      }`}
                    >
                      {SPORT_EMOJI[s]} {s}
                    </HapticButton>
                  ))}
                </div>
              </div>

              {/* 제목 */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">제목</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="예) 강남 5:5 축구 같이 해요!"
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-brand/60"
                />
              </div>

              {/* 장소 검색 */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">장소 검색</label>
                <div className="relative">
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    placeholder="장소명 검색 (예: 수서체육공원)"
                    className={`w-full bg-neutral-800 border rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none pr-10 ${
                      locationPicked ? "border-brand/60" : "border-white/10 focus:border-brand/40"
                    }`}
                  />
                  {/* 상태 아이콘 */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-brand/40 border-t-brand rounded-full animate-spin" />
                    ) : locationPicked ? (
                      <span className="text-brand text-sm">✓</span>
                    ) : (
                      <span className="text-white/30 text-sm">🔍</span>
                    )}
                  </div>
                </div>

                {/* 선택된 위치 정보 */}
                {locationPicked && (
                  <motion.div
                    className="mt-2 bg-brand/10 border border-brand/30 rounded-xl px-3 py-2 flex items-center gap-2"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="text-brand text-sm">📍</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-brand text-xs font-bold truncate">{form.location}</p>
                      <p className="text-white/30 text-[10px]">
                        {form.lat.toFixed(5)}, {form.lng.toFixed(5)}
                      </p>
                    </div>
                    <button
                      onClick={() => { setLocationPicked(false); setLocationQuery(""); setForm((f) => ({ ...f, location: "", lat: currentPosition.lat, lng: currentPosition.lng })); }}
                      className="text-white/30 text-xs hover:text-white/60"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}

                {/* 검색 결과 드롭다운 */}
                <AnimatePresence>
                  {results.length > 0 && !locationPicked && (
                    <motion.div
                      className="mt-1 bg-neutral-800 border border-white/10 rounded-xl overflow-hidden"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      {results.map((place, i) => (
                        <button
                          key={i}
                          onClick={() => handlePickPlace(place)}
                          className="w-full px-4 py-3 text-left hover:bg-white/5 active:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                        >
                          <p className="text-white text-sm font-semibold truncate">{place.place_name}</p>
                          <p className="text-white/40 text-xs mt-0.5 truncate">
                            {place.road_address_name || place.address_name}
                          </p>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 날짜 + 인원 */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">날짜/시간</label>
                  <input
                    type="datetime-local"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-brand/60"
                  />
                </div>
                <div className="w-24">
                  <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">최대 인원</label>
                  <input
                    type="number"
                    value={form.maxPlayers}
                    min={2} max={30}
                    onChange={(e) => setForm((f) => ({ ...f, maxPlayers: Number(e.target.value) }))}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-brand/60 text-center"
                  />
                </div>
              </div>

              {/* 내용 (선택) */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">내용 (선택)</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="실력, 준비물, 연락처 등"
                  rows={3}
                  className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-brand/60 resize-none"
                />
              </div>

              <HapticButton
                haptic="success"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className={`w-full py-4 rounded-2xl font-black text-base ${
                  canSubmit ? "bg-brand text-white shadow-xl shadow-brand/30" : "bg-neutral-700 text-white/20"
                }`}
              >
                {isPending ? "게임 열는 중..." : "📍 이 위치에 게임 열기"}
              </HapticButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
