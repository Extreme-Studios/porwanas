import { NextResponse } from "next/server";
import { callAppsScript } from "@/lib/apps-script";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const result = await callAppsScript({ action: "login", username, password });
    const response = NextResponse.json({ ok: true, admin: result.admin });
    response.cookies.set("porwanas_admin_session", result.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 8, path: "/" });
    return response;
  } catch (error) { return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Login gagal." }, { status: 401 }); }
}
