"use client";
import { useState } from "react";
import { Weather } from "../../../type/weather";

export default function WeatherPrepPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (city.trim() == "") {
      return;
    }
    setLoading(true);
    setError("");
  }
  return <div></div>;
}
