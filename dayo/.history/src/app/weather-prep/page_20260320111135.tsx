"use client";
import { useState } from "react";
import { Weather } from "../../../type/weather";

export default function WeatherPrepPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (city.trim() === "") {
      return;
    }
    setLoading(true);
    setError("");

    try {
      const key = process.env.NEXT_PUBLIC_WEATHER_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&u  nits=metric&lang=kr`,
      );
      if (!response.ok) {
        throw new Error("not found");
      }

      const data = await response.json();
      setWeather({
        name: data.name,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      });
    } catch (error) {
      setError("도시명을 다시 확인해 주세요 ");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col ">
      <input
        type="text"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="도시명 입력 (영어)"
      />
      <button>검색</button>
    </div>
  );
}
