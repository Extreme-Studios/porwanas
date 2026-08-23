import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callAppsScript } from "@/lib/apps-script";

async function requestToScript(request: Request) {
  const token = (await cookies()).get("porwanas_admin_session")?.value;
  if (!token) throw new Error("Sesi admin berakhir. Silakan login kembali.");
  const body = request.method === "GET" ? { action: new URL(request.url).searchParams.get("action") || "dashboard" } : await request.json();
  return callAppsScript({ ...body, token });
}
export async function GET(request: Request) { try { return NextResponse.json(await requestToScript(request)); } catch (error) { return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Gagal." }, { status: 401 }); } }
export async function POST(request: Request) { try { return NextResponse.json(await requestToScript(request)); } catch (error) { return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Gagal." }, { status: 400 }); } }
