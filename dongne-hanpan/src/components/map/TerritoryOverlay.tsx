"use client";

import { useMemo } from "react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import {
  latLngToCell,
  getSurroundingCells,
  cellToBounds,
  cellKey,
  assignCellOwner,
  neighborhoodColor,
} from "@/utils/territory";
import type { LatLng } from "@/hooks/useMap";

interface TerritoryOverlayProps {
  position: LatLng;
  myNeighborhood: string;
  allNeighborhoods: string[];
}

export default function TerritoryOverlay({
  position,
  myNeighborhood,
  allNeighborhoods,
}: TerritoryOverlayProps) {
  const cells = useMemo(() => {
    const center = latLngToCell(position.lat, position.lng);
    return getSurroundingCells(center, 2).map((cell) => {
      const owner = assignCellOwner(cell, allNeighborhoods, center, myNeighborhood);
      const bounds = cellToBounds(cell);
      const isMe = owner === myNeighborhood;
      return { cell, owner, bounds, isMe, key: cellKey(cell) };
    });
  }, [position.lat, position.lng, myNeighborhood, allNeighborhoods]);

  return (
    <>
      {cells.map(({ bounds, owner, isMe, key }) => (
        <TerritoryRect
          key={key}
          bounds={bounds}
          fillColor={neighborhoodColor(owner, isMe ? 0.22 : 0.1)}
          strokeOpacity={isMe ? 0.18 : 0.08}
          strokeWeight={1}
        />
      ))}
    </>
  );
}

/** kakao.maps.Rectangle을 직접 사용하는 wrapper */
function TerritoryRect({
  bounds,
  fillColor,
  strokeOpacity,
  strokeWeight,
}: {
  bounds: { sw: { lat: number; lng: number }; ne: { lat: number; lng: number } };
  fillColor: string;
  strokeColor?: string;
  strokeOpacity: number;
  strokeWeight: number;
}) {
  // CustomOverlayMap으로 셀 중앙에 투명 오버레이를 띄우는 대신
  // useEffect + kakao.maps.Rectangle을 직접 그림
  // → Map children으로 렌더링되므로 kakao 전역이 이미 로드된 상태
  const center = {
    lat: (bounds.sw.lat + bounds.ne.lat) / 2,
    lng: (bounds.sw.lng + bounds.ne.lng) / 2,
  };
  const width = Math.abs(bounds.ne.lng - bounds.sw.lng);
  const height = Math.abs(bounds.ne.lat - bounds.sw.lat);

  // 픽셀 크기를 추정: 0.005° ≈ 500m, 지도 level 3 기준 약 100px
  // CustomOverlayMap div로 사각형을 흉내 냄
  const pxW = Math.round((width / 0.005) * 110);
  const pxH = Math.round((height / 0.005) * 110);

  return (
    <CustomOverlayMap position={center} zIndex={1} clickable={false}>
      <div
        style={{
          width: pxW,
          height: pxH,
          backgroundColor: fillColor,
          border: `${strokeWeight}px solid rgba(255,255,255,${strokeOpacity})`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </CustomOverlayMap>
  );
}
