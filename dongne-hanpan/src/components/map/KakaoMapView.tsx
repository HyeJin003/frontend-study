"use client";

import { memo, useState, useRef, useEffect } from "react";
import { Map, useKakaoLoader } from "react-kakao-maps-sdk";
import { motion, AnimatePresence } from "framer-motion";
import AvatarMarker from "./AvatarMarker";
import GameMarker from "@/components/game/GameMarker";
import TerritoryOverlay from "./TerritoryOverlay";
import MapSkeleton from "@/components/ui/MapSkeleton";
import type { LatLng } from "@/hooks/useMap";
import type { AvatarTier } from "@/types";
import type { Post } from "@/types";
import type { AvatarCustom } from "@/store/useAvatarStore";

interface KakaoMapViewProps {
  position: LatLng;
  isLocating: boolean;
  tier: AvatarTier;
  gender?: import("@/types/avatar").Gender;
  custom?: AvatarCustom;
  username?: string;
  games?: Post[];
  selectedGameId?: number | null;
  onGameMarkerClick?: (game: Post) => void;
  myNeighborhood?: string;
  allNeighborhoods?: string[];
}

function KakaoMapViewInner({
  position, isLocating, tier, gender = "male", custom, username,
  games = [], selectedGameId = null, onGameMarkerClick,
  myNeighborhood = "내 동네", allNeighborhoods = [],
}: KakaoMapViewProps) {
  const [sdkLoading, sdkError] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY!,
    libraries: ["services"],
  });

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isCentered, setIsCentered] = useState(true);
  const mapRef = useRef<kakao.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || isLocating || !isCentered) return;
    mapRef.current.panTo(new kakao.maps.LatLng(position.lat, position.lng));
  }, [position.lat, position.lng, isLocating, isCentered]);

  const showSkeleton = sdkLoading || isLocating || !isMapLoaded;

  const handleRecenter = () => {
    if (!mapRef.current) return;
    mapRef.current.panTo(new kakao.maps.LatLng(position.lat, position.lng));
    setIsCentered(true);
  };

  if (sdkError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-900">
        <p className="text-red-400 text-sm">지도 로드 실패. API 키를 확인해주세요.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {!sdkLoading && (
        <Map
          center={position}
          style={{ width: "100%", height: "100%" }}
          level={3}
          onCreate={(map) => { mapRef.current = map; setIsMapLoaded(true); }}
          onDragStart={() => setIsCentered(false)}
        >
          {/* 동네 영역 오버레이 */}
          {isMapLoaded && !isLocating && (
            <TerritoryOverlay
              position={position}
              myNeighborhood={myNeighborhood}
              allNeighborhoods={[myNeighborhood, ...allNeighborhoods.filter((n) => n !== myNeighborhood)]}
            />
          )}

          {/* 내 아바타 마커 */}
          {!isLocating && (
            <AvatarMarker
              position={position}
              tier={tier}
              gender={gender}
              custom={custom}
              username={username}
            />
          )}

          {/* 게임 마커들 — 포켓몬고 스타일 */}
          {isMapLoaded && games.map((game) => (
            <GameMarker
              key={game._id}
              game={game}
              isSelected={selectedGameId === game._id}
              onClick={onGameMarkerClick ?? (() => {})}
            />
          ))}
        </Map>
      )}

      {/* 내 위치로 버튼 */}
      <AnimatePresence>
        {isMapLoaded && !isLocating && !isCentered && (
          <motion.button
            key="recenter"
            className="absolute bottom-36 right-4 z-20 bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg border border-neutral-200"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRecenter}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="#FF8200" />
              <circle cx="12" cy="12" r="7" stroke="#FF8200" strokeWidth="2" fill="none" />
              <line x1="12" y1="2" x2="12" y2="5" stroke="#FF8200" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="19" x2="12" y2="22" stroke="#FF8200" strokeWidth="2" strokeLinecap="round" />
              <line x1="2" y1="12" x2="5" y2="12" stroke="#FF8200" strokeWidth="2" strokeLinecap="round" />
              <line x1="19" y1="12" x2="22" y2="12" stroke="#FF8200" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Skeleton */}
      <AnimatePresence>
        {showSkeleton && (
          <motion.div
            key="skeleton"
            className="absolute inset-0 z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <MapSkeleton />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMapLoaded && !isLocating && (
          <motion.div
            key="fade-in"
            className="absolute inset-0 z-10 bg-white pointer-events-none"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const KakaoMapView = memo(KakaoMapViewInner, (prev, next) =>
  prev.isLocating === next.isLocating &&
  prev.tier === next.tier &&
  prev.gender === next.gender &&
  JSON.stringify(prev.custom) === JSON.stringify(next.custom) &&
  prev.position.lat === next.position.lat &&
  prev.position.lng === next.position.lng &&
  prev.games === next.games &&
  prev.selectedGameId === next.selectedGameId &&
  prev.myNeighborhood === next.myNeighborhood &&
  prev.allNeighborhoods === next.allNeighborhoods,
);

export default KakaoMapView;
