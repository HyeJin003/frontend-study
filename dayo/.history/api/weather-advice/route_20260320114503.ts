import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { name, temp, feels_like, humidity, description } =
    await request.json();
}
