import { useState } from "react";
import { Weather } from "../../../type/weather";

export default function WeatherPrepPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // fetch(
  //   `api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=kr`,
  // );
  return <div></div>;
}
