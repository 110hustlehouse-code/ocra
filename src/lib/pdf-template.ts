import { marked } from "marked";

export type PdfMetaItem = { label: string; value: string };

export type PdfDocInput = {
  docType: string;
  docNumber?: string;
  title: string;
  meta?: PdfMetaItem[];
  markdown: string;
  logoB64: string;
};

/**
 * Se il markdown generato dall'AI inizia col proprio blocco titolo/meta
 * (pattern "# TITOLO ... --- "), lo rimuoviamo: il titolo e i metadati
 * sono già mostrati nell'header brandizzato, non li vogliamo doppi.
 */
function stripLeadingHeaderBlock(md: string): string {
  const probe = md.slice(0, 700);
  const idx = probe.search(/\n-{3,}\s*\n/);
  if (idx === -1) return md;
  // Solo se nel blocco iniziale c'è effettivamente un titolo in stile "# ..."
  if (!/^#\s+/.test(probe.trimStart())) return md;
  const cut = md.indexOf(probe.match(/\n-{3,}\s*\n/)![0], 0) + probe.match(/\n-{3,}\s*\n/)![0].length;
  return md.slice(cut).trim();
}

export function renderFulcroDocHtml(input: PdfDocInput): string {
  const body = stripLeadingHeaderBlock(input.markdown);
  const bodyHtml = marked.parse(body, { async: false }) as string;
  const metaRow = (input.meta ?? [])
    .map((m) => `<div>${esc(m.label)}<strong>${esc(m.value)}</strong></div>`)
    .join("");

  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8" />
<title>${esc(input.title)}</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #17181c;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page { width: 210mm; min-height: 297mm; position: relative; background: #fff; }

  /* ── Header brandizzato ── */
  .head {
    background: #0a0a0b;
    color: #fff;
    padding: 16mm 16mm 14mm;
    position: relative;
    overflow: hidden;
  }
  .head::after {
    content: "";
    position: absolute;
    right: -60px; top: -80px;
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(131,24,244,0.35) 0%, rgba(131,24,244,0) 70%);
  }
  .head-tri {
    position: absolute; right: 10mm; bottom: -18mm; width: 160px; height: 160px;
    opacity: 0.18; z-index: 0;
  }
  .head-top {
    display: flex; align-items: center; justify-content: space-between;
    position: relative; z-index: 1;
  }
  .brand { display: flex; align-items: center; gap: 10px; }
  .brand img { width: 34px; height: auto; display: block; }
  .brand-name { font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }
  .brand-sub { font-size: 8.5px; color: #9a9aa3; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px; }
  .doc-tag {
    font-size: 9.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    color: #c9a6ff; border: 1px solid rgba(131,24,244,0.5); border-radius: 20px;
    padding: 5px 12px; background: rgba(131,24,244,0.12); white-space: nowrap;
  }
  .head-title {
    font-size: 30px; font-weight: 800; letter-spacing: -0.02em; margin: 20px 0 4px;
    position: relative; z-index: 1; max-width: 90%;
  }
  .head-meta {
    display: flex; gap: 28px; margin-top: 14px; position: relative; z-index: 1; flex-wrap: wrap;
  }
  .head-meta div { font-size: 9.5px; color: #9a9aa3; }
  .head-meta strong { display: block; font-size: 12px; color: #fff; font-weight: 600; margin-top: 2px; }
  .accent-bar { height: 4px; background: linear-gradient(90deg, #8318f4, #b06bff 60%, transparent); }

  /* ── Corpo: markdown generico stilizzato ── */
  .body { padding: 14mm 16mm 12mm; }
  .prose-fulcro h1 {
    font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 14px;
  }
  .prose-fulcro h2 {
    font-size: 9.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
    color: #8318f4; margin: 26px 0 12px; padding-top: 14px; border-top: 1px solid #ececef;
  }
  .prose-fulcro h2:first-child { margin-top: 0; padding-top: 0; border-top: none; }
  .prose-fulcro h3 {
    font-size: 13.5px; font-weight: 700; letter-spacing: -0.01em; margin: 16px 0 2px;
    display: flex; align-items: center; gap: 8px;
  }
  .prose-fulcro h3::before {
    content: ""; width: 7px; height: 7px; background: #8318f4; border-radius: 2px;
    transform: rotate(45deg); flex-shrink: 0;
  }
  .prose-fulcro h3 + p {
    font-weight: 800; color: #8318f4; font-size: 13.5px; margin: 0 0 10px 15px;
  }
  .prose-fulcro p { font-size: 10.5px; line-height: 1.75; color: #3d3e44; margin: 0 0 10px; }
  .prose-fulcro ul, .prose-fulcro ol { margin: 0 0 12px; padding-left: 0; }
  .prose-fulcro li {
    list-style: none; font-size: 10px; color: #45464d; padding: 3px 0 3px 16px; position: relative; line-height: 1.6;
  }
  .prose-fulcro ul li::before {
    content: ""; position: absolute; left: 2px; top: 9px; width: 5px; height: 5px;
    border-radius: 50%; background: #8318f4;
  }
  .prose-fulcro ol { counter-reset: item; }
  .prose-fulcro ol li { counter-increment: item; }
  .prose-fulcro ol li::before { content: counter(item) "."; position: static; margin-right: 6px; color: #8318f4; font-weight: 700; }
  .prose-fulcro strong { font-weight: 700; color: #17181c; }
  .prose-fulcro hr { border: none; border-top: 1px solid #ececef; margin: 22px 0; }
  .prose-fulcro blockquote {
    margin: 0 0 16px; font-size: 10.5px; line-height: 1.75; color: #45464d;
    background: #f7f3fe; border-left: 3px solid #8318f4; padding: 12px 16px; border-radius: 0 8px 8px 0;
  }
  .prose-fulcro blockquote p { margin: 0; color: inherit; }
  .prose-fulcro table { width: 100%; border-collapse: collapse; margin: 6px 0 16px; }
  .prose-fulcro th {
    background: #0a0a0b; color: #fff; text-align: left; font-size: 9.5px; font-weight: 600;
    letter-spacing: 0.04em; padding: 10px 14px;
  }
  .prose-fulcro th:last-child, .prose-fulcro td:last-child { text-align: right; }
  .prose-fulcro td { font-size: 11px; padding: 9px 14px; border-bottom: 1px solid #efeff1; color: #2c2d32; }
  .prose-fulcro tr:last-child td {
    font-weight: 800; font-size: 13px; background: #f7f3fe; color: #0a0a0b; border-top: 2px solid #8318f4;
  }

  .foot {
    margin: 26px 16mm 0; padding: 14px 0; border-top: 1px solid #ececef;
    display: flex; align-items: center; justify-content: space-between;
  }
  .foot-brand { display: flex; align-items: center; gap: 8px; }
  .foot-brand img { width: 16px; height: auto; }
  .foot-brand span { font-size: 9.5px; font-weight: 700; color: #17181c; }
  .foot-meta { font-size: 8.5px; color: #a3a3aa; text-align: right; line-height: 1.5; }
</style>
</head>
<body>
  <div class="page">
    <div class="head">
      <svg class="head-tri" viewBox="0 0 100 100" fill="none">
        <path d="M50 5 L95 90 L5 90 Z" stroke="#ffffff" stroke-width="1.4" />
      </svg>
      <div class="head-top">
        <div class="brand">
          <img src="data:image/png;base64,${input.logoB64}" alt="Fulcro Lucem" />
          <div>
            <div class="brand-name">FULCRO LUCEM</div>
            <div class="brand-sub">Business · Creatività · Marketing</div>
          </div>
        </div>
        <div class="doc-tag">${esc(input.docType)}${input.docNumber ? " N. " + esc(input.docNumber) : ""}</div>
      </div>
      <div class="head-title">${esc(input.title)}</div>
      ${metaRow ? `<div class="head-meta">${metaRow}</div>` : ""}
    </div>
    <div class="accent-bar"></div>

    <div class="body">
      <div class="prose-fulcro">${bodyHtml}</div>
    </div>

    <div class="foot">
      <div class="foot-brand">
        <img src="data:image/png;base64,${input.logoB64}" alt="" />
        <span>Fulcro Lucem S.r.l.</span>
      </div>
      <div class="foot-meta">
        ${esc(input.docType)}${input.docNumber ? " N. " + esc(input.docNumber) : ""} · Generato con OCRA<br/>
        Riservato — uso esclusivo del destinatario
      </div>
    </div>
  </div>
</body>
</html>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

