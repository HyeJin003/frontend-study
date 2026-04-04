"use client";

import { useMemo, useEffect, useRef } from "react";
import { useMap } from "react-kakao-maps-sdk";
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
  const map = useMap();
  const polygonsRef = useRef<kakao.maps.Rectangle[]>([]);

  const cells = useMemo(() => {
    const center = latLngToCell(position.lat, position.lng);
    return getSurroundingCells(center, 2).map((cell) => {
      const owner = assignCellOwner(cell, allNeighborhoods, center, myNeighborhood);
      const bounds = cellToBounds(cell);
      const isMe = owner === myNeighborhood;
      return { cell, owner, bounds, isMe, key: cellKey(cell) };
    });
  }, [position.lat, position.lng, myNeighborhood, allNeighborhoods]);

  useEffect(() => {
    if (!map) return;

    // 기존 폴리곤 제거
    polygonsRef.current.forEach((r) => r.setMap(null));
    polygonsRef.current = [];

    cells.forEach(({ bounds, owner, isMe }) => {
      const sw = new kakao.maps.LatLng(bounds.sw.lat, bounds.sw.lng);
      const ne = new kakao.maps.LatLng(bounds.ne.lat, bounds.ne.lng);
      const rect = new kakao.maps.Rectangle({
        bounds: new kakao.maps.LatLngBounds(sw, ne),
        strokeWeight: isMe ? 2 : 1,
        strokeColor: isMe ? neighborhoodColor(owner, 1) : "rgba(255,255,255,0.3)",
        strokeOpacity: isMe ? 0.7 : 0.15,
        strokeStyle: "solid",
        fillColor: neighborhoodColor(owner, isMe ? 0.25 : 0.08),
        fillOpacity: 1,
        zIndex: isMe ? 2 : 1,
      });
      rect.setMap(map);
      polygonsRef.current.push(rect);
    });

    return () => {
      polygonsRef.current.forEach((r) => r.setMap(null));
      polygonsRef.current = [];
    };
  }, [map, cells]);

  return null;
}
