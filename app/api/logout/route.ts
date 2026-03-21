import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const url = new URL("/", request.url);
  const response = NextResponse.redirect(url);
  response.cookies.delete("daylens_session");
  return response;
}
