/**
 * AI Service — LLM 백엔드와 통신하는 인증샷 분석 모듈
 *
 * 현재는 인터페이스만 정의되어 있습니다.
 * 백엔드 LLM 엔드포인트 확정 후 구현체를 채워 넣으세요.
 */
import apiInstance from "./apiInstance";
import type { FashionTier } from "@/types";

// ── 요청/응답 타입 ────────────────────────────────────────────────────────────

export interface AuthShotAnalysisRequest {
  /** Base64 인코딩된 이미지 데이터 (data:image/jpeg;base64,...) */
  imageBase64: string;
  /** 추가 컨텍스트 (예: 종목, 경기장 등) */
  context?: string;
}

export interface AuthShotAnalysisResponse {
  /** 분석된 패션 등급 */
  fashionTier: FashionTier;
  /** LLM이 판정한 이유 */
  reason: string;
  /** 0~100 신뢰도 점수 */
  confidenceScore: number;
  /** 감지된 의상 키워드 목록 */
  detectedItems: string[];
}

// ── 함수 인터페이스 ───────────────────────────────────────────────────────────

/**
 * 인증샷 이미지를 LLM 백엔드에 전송해 패션 등급을 분석합니다.
 * @param payload - Base64 이미지 + 컨텍스트
 * @returns 패션 등급 및 분석 결과
 */
export async function analyzeAuthShot(
  payload: AuthShotAnalysisRequest,
): Promise<AuthShotAnalysisResponse> {
  // TODO: 실제 LLM 엔드포인트 경로로 교체
  const response = await apiInstance.post<AuthShotAnalysisResponse>(
    "/api/ai/analyze-fashion",
    payload,
  );
  return response.data;
}

/**
 * 유저의 과거 인증샷 분석 이력을 조회합니다.
 * @param userId - 유저 ID
 */
export async function getAnalysisHistory(
  userId: string,
): Promise<AuthShotAnalysisResponse[]> {
  // TODO: 실제 엔드포인트 경로로 교체
  const response = await apiInstance.get<AuthShotAnalysisResponse[]>(
    `/api/ai/history/${userId}`,
  );
  return response.data;
}
