export async function callAppsScript(payload: Record<string, unknown>) {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url || url.includes("GANTI_DENGAN")) throw new Error("APPS_SCRIPT_URL belum diatur di Vercel.");
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    cache: "no-store",
    redirect: "follow",
  });
  const data = await response.json().catch(() => ({ ok: false, message: "Respons Google Apps Script tidak valid." }));
  if (!response.ok || !data.ok) throw new Error(data.message || "Google Sheet tidak dapat dihubungi.");
  return data;
}
