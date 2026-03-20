"use client";
import { useState } from "react";
import { Weather } from "../../../type/weather";
import { useAuthGuard } from "../hooks/useAuthGuard";

export default function WeatherPrepPage() {
  useAuthGuard();
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noWeather, setNoWeather] = useState(false);
  const [advice, setAdvice] = useState("");
  const [tab, setTap] = useState<"weather" | "apps" | "tips" | "shopping" | "landmarks" | "restaurants">("weather");
  const [app, setApp] = useState<
    { name: string; icon: string; desc: string }[]
  >([]);
  const [tips, setTips] = useState<
    { icon: string; title: string; desc: string }[]
  >([]);
  const [shopping, setShopping] = useState<
    { icon: string; name: string; category: string; desc: string }[]
  >([]);
  const [landmarks, setLandmarks] = useState<
    { icon: string; name: string; desc: string; hours: string; booking: string }[]
  >([]);
  const [restaurants, setRestaurants] = useState<
    { icon: string; name: string; category: string; desc: string; location: string }[]
  >([]);
  async function handleSearch() {
    if (city.trim() === "") return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/weather-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });

      if (!res.ok) throw new Error("not found");

      const { weather, noWeather, advice, apps, tips, shopping, landmarks, restaurants } = await res.json();
      setWeather(weather);
      setNoWeather(noWeather);
      setAdvice(advice);
      setApp(apps);
      setTips(tips);
      setShopping(shopping);
      setLandmarks(landmarks);
      setRestaurants(restaurants);
      // 날씨 없으면 앱 탭으로 자동 이동
      if (noWeather) setTap("apps");
    } catch {
      setError("도시명을 다시 확인해 주세요");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="px-4 py-6 max-w-xl mx-auto">
      <h1 className="text-lg font-bold text-gray-800 mb-4">🌤️ 여행 준비</h1>

      {/* 검색창 */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="도시명 입력  ex) 도쿄, 파리, 상하이"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition"
        >
          검색
        </button>
      </div>

      {/* 로딩 */}
      {loading && (
        <p className="text-center text-gray-400 text-sm py-10">
          🌍 여행 정보를 불러오는 중...
        </p>
      )}

      {/* 에러 */}
      {error && (
        <p className="text-center text-red-400 text-sm py-4">❌ {error}</p>
      )}

      {/* 날씨 결과 */}
      {weather && !loading && (
        <div className="flex flex-col gap-4">
          {/* 탭 버튼 */}
          <div className="flex border-b border-gray-200 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setTap("weather")}
              className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 transition ${
                tab === "weather"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400"
              }`}
            >
              여행 준비물
            </button>
            <button
              onClick={() => setTap("apps")}
              className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 transition ${
                tab === "apps"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400"
              }`}
            >
              필수 앱
            </button>
            <button
              onClick={() => setTap("tips")}
              className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 transition ${
                tab === "tips"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400"
              }`}
            >
              여행 꿀팁
            </button>
            <button
              onClick={() => setTap("shopping")}
              className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 transition ${
                tab === "shopping"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400"
              }`}
            >
              현지 쇼핑
            </button>
            <button
              onClick={() => setTap("landmarks")}
              className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 transition ${
                tab === "landmarks"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400"
              }`}
            >
              랜드마크
            </button>
            <button
              onClick={() => setTap("restaurants")}
              className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 transition ${
                tab === "restaurants"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400"
              }`}
            >
              맛집
            </button>
          </div>

          {/* 날씨 준비물 탭 */}
          {tab === "weather" && (
            <div className="flex flex-col gap-4">
              {/* 날씨 없을 때 안내 */}
              {noWeather && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-yellow-600 font-medium">날씨 정보를 찾을 수 없는 지역이에요</p>
                  <p className="text-xs text-yellow-400 mt-1">다른 탭에서 여행 정보를 확인해보세요!</p>
                </div>
              )}
              {/* 날씨 카드 */}
              {weather && <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-sky-50 px-4 py-3 flex items-center gap-3">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.description}
                    className="w-14 h-14"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      {weather.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {weather.description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-gray-100 bg-white">
                  <div className="py-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">🌡️ 기온</p>
                    <p className="text-base font-bold text-gray-800">
                      {Math.round(weather.temp)}°C
                    </p>
                  </div>
                  <div className="py-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">🤔 체감</p>
                    <p className="text-base font-bold text-gray-800">
                      {Math.round(weather.feels_like)}°C
                    </p>
                  </div>
                  <div className="py-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">💧 습도</p>
                    <p className="text-base font-bold text-gray-800">
                      {weather.humidity}%
                    </p>
                  </div>
                </div>
              </div>}

              {/* AI 준비물 추천 */}
              {advice && (
                <div className="border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 mb-2">
                    ✨ AI 준비물 추천
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {advice}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 필수 앱 탭 */}
          {tab === "apps" && (
            <div className="flex flex-col gap-3">
              {app.map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 border border-gray-100 rounded-xl p-3 shadow-sm"
                >
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {a.name}
                    </p>
                    <p className="text-xs text-gray-500">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 여행 꿀팁 탭 */}
          {tab === "tips" && (
            <div className="flex flex-col gap-3">
              {tips.map((t, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 border border-gray-100 rounded-xl p-3 shadow-sm"
                >
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {t.title}
                    </p>
                    <p className="text-xs text-gray-500">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 현지 쇼핑 탭 */}
          {tab === "shopping" && (
            <div className="flex flex-col gap-3">
              {shopping.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 border border-gray-100 rounded-xl p-3 shadow-sm"
                >
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                      <span className="text-xs bg-blue-50 text-blue-400 px-2 py-0.5 rounded-full">{s.category}</span>
                    </div>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 랜드마크 탭 */}
          {tab === "landmarks" && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-400 text-center">⚠️ 정확한 정보는 공식 사이트에서 확인하세요</p>
              {landmarks.map((l, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-xl p-3 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{l.icon}</span>
                    <p className="text-sm font-semibold text-gray-800">{l.name}</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{l.desc}</p>
                  <p className="text-xs text-gray-400">🕐 {l.hours}</p>
                  <p className="text-xs text-gray-400">🎟️ {l.booking}</p>
                </div>
              ))}
            </div>
          )}
          {/* 맛집 탭 */}
          {tab === "restaurants" && (
            <div className="flex flex-col gap-3">
              {restaurants.map((r, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 border border-gray-100 rounded-xl p-3 shadow-sm"
                >
                  <span className="text-2xl">{r.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-gray-800">{r.name}</p>
                      <span className="text-xs bg-orange-50 text-orange-400 px-2 py-0.5 rounded-full">{r.category}</span>
                    </div>
                    <p className="text-xs text-gray-500">{r.desc}</p>
                    <p className="text-xs text-gray-400 mt-0.5">📍 {r.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
