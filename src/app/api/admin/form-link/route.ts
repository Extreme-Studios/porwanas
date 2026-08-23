import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const session = (await cookies()).get("porwanas_admin_session")?.value;
  const destination = process.env.GOOGLE_FORM_ADMIN_URL;
  if (!session || !destination) return NextResponse.redirect(new URL("/admin", request.url));
  return NextResponse.redirect(destination);
}
