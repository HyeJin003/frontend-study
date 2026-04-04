"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface LatLng {
  lat: number;
  lng: number;
}

export type LocationStatus = "idle" | "loading" | "success" | "error";

export interface UseMapReturn {
  /** 현재 GPS 좌표 (아직 없으면 null) */
  position: LatLng | null;
  /** 위치 추적 상태 */
  status: LocationStatus;
  /** Geolocation 오류 메시지 */
  error: string | null;
  /** 수동으로 위치를 재요청 */
  refresh: () => void;
  /** 위치 정확도(m) */
  accuracy: number | null;
}

const DEFAULT_POSITION: LatLng = { lat: 37.5665, lng: 126.978 }; // 서울 시청 fallback

export function useMap(): UseMapReturn {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 정보를 지원하지 않습니다.");
      setStatus("error");
      setPosition(DEFAULT_POSITION);
      return;
    }

    setStatus("loading");
    setError(null);

    // watchPosition: GPS가 바뀔 때마다 콜백 실행 (실시간 추적)
    watchIdRef.current = navigator.geolocation.watchPosition(
      (geo) => {
        setPosition({ lat: geo.coords.latitude, lng: geo.coords.longitude });
        setAccuracy(geo.coords.accuracy);
        setStatus("success");
      },
      (err) => {
        const messages: Record<number, string> = {
          1: "위치 접근 권한이 거부되었습니다.",
          2: "위치 정보를 가져올 수 없습니다.",
          3: "위치 요청 시간이 초과되었습니다.",
        };
        setError(messages[err.code] ?? "알 수 없는 위치 오류");
        setStatus("error");
        setPosition(DEFAULT_POSITION); // fallback
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 5_000, // 5초 이내 캐시 허용
      },
    );
  }, []);

  useEffect(() => {
    startWatching();
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [startWatching]);

  const refresh = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    startWatching();
  }, [startWatching]);

  return { position, status, error, refresh, accuracy };
}
