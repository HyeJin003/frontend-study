"use client";

import { Map } from "react-kakao-maps-sdk";
import { type ReactNode } from "react";

/**
 * react-kakao-maps-sdk v1.1+ 는 스크립트 로딩을 라이브러리가 자체 처리합니다.
 * 단, KAKAO_MAP_API_KEY 환경변수가 반드시 필요합니다.
 *
 * 이 컴포넌트는 SDK 키를 앱 전역에 한 번만 설정하기 위한 래퍼입니다.
 * layout.tsx에서 children을 감싸 주세요.
 */

// react-kakao-maps-sdk는 Map 컴포넌트 렌더링 전에
// window.kakao.maps가 로드되어야 합니다.
// → next/script + useKakaoLoader 조합으로 처리합니다.

export { Map };

interface KakaoMapProviderProps {
  children: ReactNode;
}

// 이 파일은 향후 useKakaoLoader 훅으로 확장 가능한 진입점입니다.
export default function KakaoMapProvider({ children }: KakaoMapProviderProps) {
  return <>{children}</>;
}
