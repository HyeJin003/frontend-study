"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import HapticButton from "@/components/ui/HapticButton";

interface NeighborhoodSheetProps {
  open: boolean;
  onClose: () => void;
  onNeighborhoodSelect?: (name: string, position: { lat: number; lng: number }) => void;
}

interface KakaoPlace {
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
}

// 자주 쓰는 서울 주요 동네
const POPULAR = [
  "역삼동", "강남동", "서초동", "마포동", "홍대입구",
  "합정동", "용산동", "여의도동", "신촌동", "성수동",
  "건대입구", "잠실동", "송파동", "강동동", "목동",
];

export default function NeighborhoodSheet({ open, onClose, onNeighborhoodSelect }: NeighborhoodSheetProps) {
  const setNeighborhood = useAuthStore((s) => s.setNeighborhood);
  const [cityName, setCityName] = useState<string | null>(null);
  const current = useAuthStore((s) => s.neighborhood);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KakaoPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelected(null);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // ── Kakao Places 검색 ───────────────────────────────────────────
  const search = useCallback((q: string) => {
    if (!q.trim()) { setResults([]); return; }
    if (!window.kakao?.maps?.services) return;
    setIsSearching(true);
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(
      q,
      (data: KakaoPlace[], status: string) => {
        setIsSearching(false);
        if (status === "OK") setResults(data.slice(0, 8));
        else setResults([]);
      },
      { category_group_code: "" },
    );
  }, []);

  const handleInput = (v: string) => {
    setQuery(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(v), 350);
  };

  // ── 주소에서 동 추출 ────────────────────────────────────────────
  const extractDong = (place: KakaoPlace): string => {
    const addr = place.road_address_name || place.address_name;
    // "서울 강남구 역삼동 ..." → "역삼동"
    const match = addr.match(/([가-힣]+동|[가-힣]+읍|[가-힣]+면)/);
    if (match) return match[1];
    // 매칭 안 되면 장소명 자체 사용
    return place.place_name;
  };

  // ── GPS로 자동 감지 ─────────────────────────────────────────────
  const detectGps = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;

        // Kakao SDK 로드 안 됐으면 좌표만으로 처리
        if (!window.kakao?.maps?.services) {
          setGpsLoading(false);
          pick("현재 위치", { lat, lng });
          return;
        }

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2RegionCode(
          lng, lat,
          (result: Array<{ region_type: string; region_2depth_name: string; region_3depth_name: string }>, status: string) => {
            setGpsLoading(false);
            if (status !== "OK" || !result.length) {
              pick("현재 위치", { lat, lng });
              return;
            }
            // 행정동(H) 우선, 없으면 법정동(B) 사용
            const region =
              result.find((r) => r.region_type === "H" && r.region_3depth_name) ??
              result.find((r) => r.region_type === "B" && r.region_3depth_name) ??
              result[0];

            const dongName = region.region_3depth_name || "현재 위치";
            const cityVal  = region.region_2depth_name || undefined;
            setCityName(cityVal ?? null);
            pick(dongName, { lat, lng }, cityVal);
          },
        );
      },
      () => setGpsLoading(false),
      { timeout: 10000, enableHighAccuracy: false },
    );
  };

  // ── 선택 확정 ───────────────────────────────────────────────────
  const pick = (name: string, presetPos?: { lat: number; lng: number }, presetCity?: string) => {
    setSelected(name);

    const commit = (pos?: { lat: number; lng: number }, city?: string) => {
      setTimeout(() => {
        setNeighborhood(name, city ?? cityName ?? undefined);
        if (pos && onNeighborhoodSelect) onNeighborhoodSelect(name, pos);
        onClose();
      }, 400);
    };

    if (presetPos) { commit(presetPos, presetCity); return; }

    // 동네 이름으로 geocoding
    if (window.kakao?.maps?.services) {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(name, (data: KakaoPlace[], status: string) => {
        if (status === "OK" && data.length > 0) {
          commit({ lat: parseFloat(data[0].y), lng: parseFloat(data[0].x) });
        } else {
          commit();
        }
      });
    } else {
      commit();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 딤 */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 시트 */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 rounded-t-3xl overflow-hidden"
            style={{ maxHeight: "85vh" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            {/* 핸들 */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* 헤더 */}
            <div className="px-5 pt-2 pb-4 border-b border-white/8">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-white font-black text-lg">🏘️ 내 동네 설정</h2>
                <button onClick={onClose} className="text-white/40 text-sm">닫기</button>
              </div>
              {current && (
                <p className="text-white/40 text-xs">현재: <span className="text-brand">{current}</span></p>
              )}
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: "calc(85vh - 120px)" }}>
              {/* 검색창 */}
              <div className="px-4 pt-4 pb-3">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-base">🔍</span>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => handleInput(e.target.value)}
                    placeholder="동네 이름 검색 (예: 역삼동, 합정동)"
                    className="w-full bg-white/8 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white text-sm placeholder-white/30 outline-none focus:border-brand/50 focus:bg-white/10 transition-all"
                  />
                  {isSearching && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 text-xs animate-pulse">검색 중...</span>
                  )}
                </div>
              </div>

              {/* GPS 감지 버튼 */}
              <div className="px-4 pb-3">
                <HapticButton
                  haptic="light"
                  onClick={detectGps}
                  disabled={gpsLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-brand/30 bg-brand/8 text-brand text-sm font-semibold active:bg-brand/15 transition-colors disabled:opacity-50"
                >
                  {gpsLoading ? (
                    <>
                      <span className="animate-spin text-base">📡</span>
                      <span>위치 감지 중...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-base">📍</span>
                      <span>현재 위치로 자동 설정</span>
                    </>
                  )}
                </HapticButton>
              </div>

              {/* 검색 결과 */}
              <AnimatePresence mode="wait">
                {results.length > 0 ? (
                  <motion.div
                    key="results"
                    className="px-4 pb-2"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-white/30 text-xs font-semibold mb-2 px-1">검색 결과</p>
                    <div className="space-y-1.5">
                      {results.map((place, i) => {
                        const dong = extractDong(place);
                        const isSelected = selected === dong;
                        return (
                          <motion.button
                            key={i}
                            onClick={() => pick(dong, { lat: parseFloat(place.y), lng: parseFloat(place.x) })}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all active:scale-98"
                            style={{
                              backgroundColor: isSelected ? "rgba(255,130,0,0.15)" : "rgba(255,255,255,0.05)",
                              border: isSelected ? "1px solid rgba(255,130,0,0.4)" : "1px solid transparent",
                            }}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                          >
                            <span className="text-lg shrink-0">{isSelected ? "✅" : "📌"}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-semibold text-sm">{dong}</p>
                              <p className="text-white/30 text-xs truncate mt-0.5">{place.address_name}</p>
                            </div>
                            {dong === current && (
                              <span className="text-brand text-[10px] font-bold shrink-0">현재</span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : query.length === 0 ? (
                  <motion.div
                    key="popular"
                    className="px-4 pb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-white/30 text-xs font-semibold mb-3 px-1">인기 동네</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map((name) => {
                        const isSelected = selected === name;
                        const isCurrent = name === current;
                        return (
                          <HapticButton
                            key={name}
                            haptic="light"
                            onClick={() => pick(name)}
                            className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                            style={{
                              backgroundColor: isSelected ? "rgba(255,130,0,0.2)" : isCurrent ? "rgba(255,130,0,0.12)" : "rgba(255,255,255,0.07)",
                              color: isCurrent || isSelected ? "#FF8200" : "rgba(255,255,255,0.7)",
                              border: isCurrent ? "1px solid rgba(255,130,0,0.4)" : "1px solid transparent",
                            }}
                          >
                            {isCurrent ? `✓ ${name}` : name}
                          </HapticButton>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
