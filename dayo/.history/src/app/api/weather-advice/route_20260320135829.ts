import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
const client = new Anthropic();
export async function POST(request: NextRequest) {
  const { name, temp, feels_like, humidity, description } =
    await request.json();

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `현재 ${name}(${country})의 날씨: ${description},기온 ${Math.round(temp)}°C,습도 ${humidity}%.
        아래 JSON 형식으로만 응답해줘. 다른 텍스트 없이 JSON만 반환해. {"advice:"날씨 기반 준비물/옷차림 3줄", "apps":[{"name":"앱이름", "icon":"이모지","desc":"한줄설명"}],
        {"icons":"이모지","title":"제목" ,"desc":"한줄설명"}}`,
      },
    ],
  });
  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return NextResponse.json({ advice: text });
}
