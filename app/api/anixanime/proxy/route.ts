import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function resolve() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  };
}

function rewriteM3U8(text: string, target: string, base: string) {
  const targetUrl = new URL(target);
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return line;
      let full: string;
      try {
        full = new URL(trimmed, targetUrl).toString();
      } catch {
        return line;
      }
      const proxy = new URL("/api/anixanime/proxy", base);
      proxy.searchParams.set("url", full);
      proxy.searchParams.set("referer", targetUrl.origin + "/");
      return proxy.toString();
    })
    .join("\n");
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const target = url.searchParams.get("url");
  if (!target) return NextResponse.json({ error: "Missing required ?url= param" }, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid url param" }, { status: 400 });
  }

  const referer = url.searchParams.get("referer") ?? parsed.origin + "/";

  const upstream = await fetch(target, {
    headers: {
      "User-Agent": UA,
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: referer,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
    },
  });

  const ct = upstream.headers.get("Content-Type") ?? "";
  const isM3U8 =
    ct.includes("mpegurl") ||
    ct.includes("x-mpegurl") ||
    parsed.pathname.endsWith(".m3u8") ||
    parsed.pathname.endsWith(".m3u");

  if (!upstream.ok) {
    return new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers: { "Content-Type": ct || "text/plain", ...resolve() },
    });
  }

  if (isM3U8) {
    const text = await upstream.text();
    const rewritten = rewriteM3U8(text, target, url.origin);
    return new NextResponse(rewritten, {
      status: 200,
      headers: { "Content-Type": "application/vnd.apple.mpegurl", ...resolve() },
    });
  }

  const buffer = await upstream.arrayBuffer();
  return new NextResponse(new Uint8Array(buffer), {
    status: upstream.status,
    headers: { "Content-Type": ct || "application/octet-stream", ...resolve() },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}