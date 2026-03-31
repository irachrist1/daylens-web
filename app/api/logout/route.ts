import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const url = new URL("/", request.url);
  const response = NextResponse.redirect(url);
  response.cookies.delete({ name: "daylens_session", path: "/daylens" });
  return response;
}
