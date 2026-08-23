import { NextResponse } from "next/server";
import { callAppsScript } from "@/lib/apps-script";

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams.get("query") || "";
    return NextResponse.json(await callAppsScript({ action: "publicVerified", query }));
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Data verifikasi belum tersedia." }, { status: 502 });
  }
}
