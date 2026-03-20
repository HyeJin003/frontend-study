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
        `https://api.openweathermap.org/data/2.5/wather?q=${city}&appid=&{key}&units=metric&lang=kr`,
      );
      if (response.ok) {
        throw new Error("not found");
      }
      const data = await response.json();
    } catch (error) {
      setError("도시명을 다시 확인해 주세요 ");
    }
  }
  return <div></div>;
}
