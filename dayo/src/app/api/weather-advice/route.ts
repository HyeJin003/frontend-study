import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const { city } = await request.json();
  const key = process.env.NEXT_PUBLIC_WEATHER_KEY;

  // AI 호출 + 날씨 fetch 동시 실행
  const [adviceRes, weatherResKo, weatherResEn] = await Promise.all([
    // AI: 번역 + 여행정보 한번에
    client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `나는 "${city}"로 여행을 가려고 해.

아래 JSON 형식으로만 응답해. 마크다운 코드블록 없이 순수 JSON만 반환해.

- englishCity: OpenWeatherMap에서 쓸 수 있는 영어 도시명 (예: Tokyo, Paris, Shanghai)
- advice: 이 도시 날씨에 맞는 옷차림/준비물 2줄
- apps: 현지 여행자 필수 앱 4개 (현지 특화 앱 위주)
- tips: 여행 꿀팁 4개
- shopping: 꼭 사야 할 것 4개 (구체적인 상품명)
- landmarks: 대표 랜드마크 4개 (운영시간/예약방법 포함)
- restaurants: 꼭 가야 할 맛집/음식 4개

{
  "englishCity": "도시영어명",
  "advice": "준비물/옷차림 2줄",
  "apps": [{ "name": "앱이름", "icon": "이모지", "desc": "한줄설명" }],
  "tips": [{ "icon": "이모지", "title": "제목", "desc": "한줄설명" }],
  "shopping": [{ "icon": "이모지", "name": "상품명", "category": "카테고리", "desc": "한줄설명" }],
  "landmarks": [{ "icon": "이모지", "name": "관광지명", "desc": "한줄설명", "hours": "운영시간", "booking": "예약방법" }],
  "restaurants": [{ "icon": "이모지", "name": "맛집이름", "category": "음식종류", "desc": "한줄설명", "location": "위치" }]
}`,
        },
      ],
    }),
    // 한국어로 날씨 먼저 시도
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric&lang=kr`),
    // 영어로도 동시 시도 (도시명이 영어일 경우 대비)
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric&lang=kr`),
  ]);

  // AI 응답 파싱
  const text = adviceRes.content[0].type === "text" ? adviceRes.content[0].text : "";
  const cleaned = text.replace(/```json|```/g, "").trim();
  const json = JSON.parse(cleaned);
  const englishCity = (json.englishCity as string).split(",")[0].trim();

  // 날씨: 한국어 도시명 실패 시 영어 도시명으로 재시도
  let weather = null;
  const tryWeather = async (q: string) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${key}&units=metric&lang=kr`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      name: data.name,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      country: data.sys.country,
    };
  };

  if (weatherResKo.ok) {
    const data = await weatherResKo.json();
    weather = {
      name: data.name,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      country: data.sys.country,
    };
  } else {
    weather = await tryWeather(englishCity);
  }

  const { englishCity: _, ...rest } = json;
  return NextResponse.json({ weather, noWeather: !weather, ...rest });
}
