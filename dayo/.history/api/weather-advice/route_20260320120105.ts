import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { name, temp, feels_like, humidity, description } =
    await request.json();

  const response = await client.messages.create({
    model: "claude-haiky-4-5"
    max_token: 512,
    messages:[{role:"user",content:}]
  })
}
