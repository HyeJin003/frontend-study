
  import Anthropic from "@anthropic-ai/sdk";                 
  import { NextRequest, NextResponse } from "next/server";
const client = new Anthropic();
export async function POST(request: NextRequest) {
  const { name, temp, feels_like, humidity, description } =
    await request.json();

  const response = await client.messages.create({
    model: "claude-haiky-4-5"
    max_token: 512,
    messages: [{
      role: "user", content: `현재 ${name}의 날씨: ${description}, 기온   ${Math.round(temp)}°C, 체감 ${Math.round(feels_like)}°C,    습도 ${humidity}%.
  이 날씨에 여행자에게 필요한 준비물과 옷차림을 3줄로        
  추천해줘. 간결하게.`,
    },]
  })
}
