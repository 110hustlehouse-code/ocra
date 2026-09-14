import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { renderFulcroDocHtml } from "@/lib/pdf-template";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: {
    docType?: string;
    docNumber?: string;
    title?: string;
    meta?: { label: string; value: string }[];
    markdown?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload non valido" }, { status: 400 });
  }

  const { docType, docNumber, title, meta, markdown } = body;
  if (!docType || !title || !markdown) {
    return NextResponse.json({ error: "docType, title e markdown sono obbligatori" }, { status: 400 });
  }

  let logoB64: string;
  try {
    const logoPath = path.join(process.cwd(), "public", "logo-fulcro.png");
    logoB64 = fs.readFileSync(logoPath).toString("base64");
  } catch {
    return NextResponse.json({ error: "Logo Fulcro non trovato in public/logo-fulcro.png" }, { status: 500 });
  }

  const html = renderFulcroDocHtml({ docType, docNumber, title, meta, markdown, logoB64 });

  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });
    const body = new Uint8Array(pdf);
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${slug(title)}.pdf"`,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "errore sconosciuto";
    return NextResponse.json(
      { error: `Generazione PDF fallita: ${msg}. Hai eseguito "npx playwright install chromium" nel Codespace?` },
      { status: 500 }
    );
  } finally {
    await browser?.close();
  }
}

function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "documento"
  );
}

