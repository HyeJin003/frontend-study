"use client";

import { useEffect, useState } from "react";

// 통화 목록 데이터
const CURRNCY_LIST = [
  { code: "JPY", name: "일본 엔", flag: "🇯🇵" },
  { code: "USD", name: "미국 달러", flag: "🇺🇸" },
  { code: "CAD", name: "캐나다 달러", flag: "🇨🇦" },
  { code: "EUR", name: "유로", flag: "🇪🇺" },
  { code: "GBP", name: "영국 파운드", flag: "🇬🇧" },
  { code: "THB", name: "태국 바트", flag: "🇹🇭" },
  { code: "VND", name: "베트남 동", flag: "🇻🇳" },
  { code: "SGD", name: "싱가포르 달러", flag: "🇸🇬" },
  { code: "AUD", name: "호주 달러", flag: "🇦🇺" },
  { code: "CNY", name: "중국 위안", flag: "🇨🇳" },
];
// 숫자 포맷 함수
function formatNum(currency: number) {
  if (currency === 0) {
    return "0";
  }
  if (currency >= 1) {
    //내장함수  toLocaleString
    return currency.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  }
  return currency.toLocaleString("ko-KR", { maximumFractionDigits: 4 });
}
// 기본 선택 통화
const DEFAULT_SELECTED = ["JPY", "USD", "EUR", "CAD"];

// localStorage 키 생성 함수
function getUserKey() {
  let uid;

  if (typeof window !== "undefined") {
    uid = localStorage.getItem("userId");
  } else {
    uid = null;
  }

  if (uid) {
    return `currency-selected-${uid}`;
  } else {
    return "currency-selected-guest";
  }
}
export default function CurrencyPage() {
  // 상태값
  const [krw, setKrw] = useState("10000");
  // krw - 입력한 원화
  const [rates, setRates] = useState<Record<string, number>>({});
  // rates - 환율 API 데이터
  const [loading, setLoading] = useState(true);
  // loading - 로딩 여부

  // error - 에러 여부
  const [error, setError] = useState(false);
  // updatedAt - 환율 기준 시간
  const [updatedAt, setUpdatedAt] = useState("");
  // selected - 선택된 통화 목록
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED);

  // 저장된 통화 불러오기 (useEffect)
  useEffect(() => {
    const saved = localStorage.getItem(getUserKey());
    if (saved) {
      try {
        setSelected(JSON.parse(saved));
      } catch (error) {
        console.error("저장된 통화 불러오기 실패:", error);
      }
    }
  }, []);
  // 환율 API 호출 (useEffect)
  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/KRW");
        const data = await response.json();
        if (data.result === "success") {
          setRates(data.rates);
          const date = new Date(data.time_last_update_utc);
          setUpdatedAt(
            date.toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          );
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  const rawAmount = Number(krw.replace(/,/g, "")) || 0;
  const amount = rawAmount;
  const displayKrw = rawAmount ? rawAmount.toLocaleString("ko-KR") : "";

  function handleKrwChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/,/g, "");
    if (raw === "" || /^\d+$/.test(raw)) setKrw(raw);
  }
  function toggleCurrency(code: string) {
    setSelected((prev) => {
      const next = prev.includes(code)
        ? prev.filter((result) => result !== code)
        : [...prev, code];
      localStorage.setItem(getUserKey(), JSON.stringify(next));
      return next;
    });
  }
  const activeCurrencies = CURRNCY_LIST.filter((choice) =>
    selected.includes(choice.code),
  );
  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      {/* 1. 제목 + 환율 기준 시간 */}
      <h1 className="text-base font-bold">환율 계산기</h1>
      <p className="text-sm text-gray-400 mt-1 mb-6">
        {loading
          ? "환율 불러오는 중..."
          : error
            ? "환율 로드 실패 (네트워크 확인)"
            : `실시간 환율 · ${updatedAt} 기준`}
      </p>

      {/* 2. 원화 입력창 */}
      <div className="mb-5">
        <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 gap-3">
          <span className="text-xl shrink-0">🇰🇷</span>
          <input
            type="text"
            inputMode="numeric"
            value={displayKrw}
            onChange={handleKrwChange}
            placeholder="10,000"
            className="flex-1 text-xl font-bold outline-none"
          />
          <span className="text-sm text-gray-400 shrink-0">원</span>
        </div>
      </div>

      {/* 3. 환산 결과 목록 */}
      {!loading && !error && (
        <div className="flex flex-col gap-2 mb-8">
          {activeCurrencies.map((current) => (
            <div
              key={current.code}
              className="flex items-center border border-gray-300 rounded-xl px-4 py-3 gap-3"
            >
              <span className="text-2xl shrink-0">{current.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">{current.name}</p>
                <p className="text-lg font-bold text-gray-800">
                  {rates[current.code]
                    ? formatNum(amount * rates[current.code])
                    : "-"}
                  <span className="text-sm font-normal text-gray-400 ml-1">
                    {current.code}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. 통화 선택 목록 */}
      <p className="text-xs font-medium text-gray-500 mb-2">통화 선택</p>
      <div className="flex flex-col gap-1">
        {CURRNCY_LIST.map((current) => (
          <button
            key={current.code}
            onClick={() => toggleCurrency(current.code)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
              selected.includes(current.code)
                ? "bg-gray-100"
                : "hover:bg-gray-50"
            }`}
          >
            <span className="text-lg shrink-0">{current.flag}</span>
            <span className="text-sm text-gray-700 flex-1">{current.name}</span>
            <span className="text-xs text-gray-400">{current.code}</span>
            {selected.includes(current.code) && (
              <svg
                className="w-4 h-4 text-gray-600 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </main>
  );
}
