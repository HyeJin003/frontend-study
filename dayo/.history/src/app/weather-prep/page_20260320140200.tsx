"use client";
import { useState } from "react";
import { Weather } from "../../../type/weather";

export default function WeatherPrepPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [advice, setAdvice] = useState("");
  const [tab, setTap] = useState<"weather" | "apps" | "tips">("weather");
  const [app, setApp] = useState<
    { name: string; icon: string; desc: string }[]
  >([]);
  async function handleSearch() {
    if (city.trim() === "") {
      return;
    }
    setLoading(true);
    setError("");

    try {
      const key = process.env.NEXT_PUBLIC_WEATHER_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=kr`,
      );
      if (!response.ok) {
        throw new Error("not found");
      }

      const data = await response.json();

      const weatherData = {
        name: data.name,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        description: data.weather[0].description,
      };
      setWeather({
        ...weatherData,
        icon: data.weather[0].icon,
        country: data.sys.country,
      });
      const adviceRes = await fetch("/api/weather-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(weatherData),
      });
      const { advice } = await adviceRes.json();
      setAdvice(advice);
    } catch (error) {
      setError("도시명을 다시 확인해 주세요 ");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="px-4 py-6 max-w-xl mx-auto">
      <h1 className="text-lg font-bold text-gray-800 mb-4">🌤️ 날씨 준비물</h1>

      {/* 검색창 */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="도시명 입력 (영어)  ex) Tokyo, Paris"
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
          🌍 날씨 정보를 불러오는 중...
        </p>
      )}

      {/* 에러 */}
      {error && (
        <p className="text-center text-red-400 text-sm py-4">❌ {error}</p>
      )}

      {/* 날씨 결과 */}
      {weather && !loading && (
        <div className="flex flex-col gap-4">
          {/* 날씨 카드 */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
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
                <p className="text-sm text-gray-500">{weather.description}</p>
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
          </div>

          {/* AI 추천 */}
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
    </div>
  );
}
