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
        content: `현재 ${name}(${country})의 날씨: ${description},기온 ${Math.round(temp)} `,
      },
    ],
  });
  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return NextResponse.json({ advice: text });
}
