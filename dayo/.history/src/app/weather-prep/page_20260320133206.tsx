"use client";
import { useState } from "react";
import { Weather } from "../../../type/weather";

export default function WeatherPrepPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [advice, setAdvice] = useState("");

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
      setWeather({ ...weatherData, icon: data.weather[0].icon });
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
    <div className="mb-5">
        <p className="text-xs font-medium text-gray-400 mb-2">나라 선택</p>
    <div className="flex flex-col ">
      <input
        type="text"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="도시명 입력 (영어)"
      />
      <button onClick={handleSearch}>검색</button>
      {loading && <p>로딩중 ...</p>}
      {error && <p>{error}</p>}
      {weather && (
        <div>
          {advice && <p>{advice}</p>}
          <h2>{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
          />
          <p>{weather.description}</p>
          <p>기온: {Math.round(weather.temp)}°C</p>
          <p>체감: {Math.round(weather.feels_like)}°C</p>
          <p>습도: {weather.humidity}%</p>
        </div>
      )}
    </div>
  );
}
