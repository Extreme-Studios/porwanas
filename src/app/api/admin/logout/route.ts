import { NextResponse } from "next/server";
export async function POST() { const response = NextResponse.json({ ok: true }); response.cookies.delete("porwanas_admin_session"); return response; }
