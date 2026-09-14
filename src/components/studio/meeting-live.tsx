"use client";

import * as React from "react";
import { Avatar, Badge } from "@/components/ui/kit";
import { Modal } from "@/components/ui/modal";

type Line = { speaker: string; text: string };

const PARTECIPANTI = ["Daniele", "Erika Nardini"];

const SCRIPT: Line[] = [
  { speaker: "Daniele", text: "Allora, facciamo il punto veloce su St'Art Factory. A che punto siamo con il Business Audit?" },
  { speaker: "Erika Nardini", text: "Abbiamo chiuso le interviste interne la settimana scorsa. Sto finendo la mappa dei processi, la consegno entro venerdì." },
  { speaker: "Daniele", text: "Perfetto. E per il Brand Development, siamo già partiti con i naming?" },
  { speaker: "Erika Nardini", text: "Non ancora, aspettavamo l'audit per non lavorare alla cieca. Appena consegno la mappa possiamo aprire lo sprint di naming, direi lunedì prossimo." },
  { speaker: "Daniele", text: "Ok, mettiamolo a calendario. C'è un rischio sul budget o sui tempi che devo sapere?" },
  { speaker: "Erika Nardini", text: "Un piccolo rischio sulle otto settimane di brand development: se il cliente non ci dà accesso ai materiali interni entro i 5 giorni concordati, slittiamo." },
  { speaker: "Daniele", text: "Va bene, lo segnalo io stesso al referente. Erika, puoi preparare tu la bozza del brand book entro la fine del mese?" },
  { speaker: "Erika Nardini", text: "Sì, me ne occupo io. Le linee guida applicative le finisco per il 30." },
  { speaker: "Daniele", text: "Ultima cosa: il preventivo per la Communication Strategy lo mandiamo insieme al resto o separato?" },
  { speaker: "Erika Nardini", text: "Io lo terrei insieme, così il cliente vede lo sconto sul pacchetto integrato. Lo prepariamo per la prossima settimana." },
  { speaker: "Daniele", text: "Perfetto, direi che ci siamo. Grazie Erika, ci sentiamo venerdì per la mappa dei processi." },
];

type Phase = "connecting" | "joining" | "live" | "done";

const SUB: Record<Phase, string> = {
  connecting: "Rilevamento piattaforma…",
  joining: "Si sta unendo a Google Meet…",
  live: "In ascolto — non parla",
  done: "Riunione terminata",
};

export function MeetingLiveModal({
  open,
  onClose,
  onTranscriptReady,
}: {
  open: boolean;
  onClose: () => void;
  onTranscriptReady: (transcript: string) => void;
}) {
  const [phase, setPhase] = React.useState<Phase>("connecting");
  const [revealed, setRevealed] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    setPhase("connecting");
    setRevealed(0);
    const t1 = setTimeout(() => setPhase("joining"), 1300);
    const t2 = setTimeout(() => setPhase("live"), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [open]);

  React.useEffect(() => {
    if (phase !== "live") return;
    if (revealed >= SCRIPT.length) { setPhase("done"); return; }
    const t = setTimeout(() => setRevealed((r) => r + 1), 950);
    return () => clearTimeout(t);
  }, [phase, revealed]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [revealed]);

  const transcriptText = SCRIPT.map((l) => `${l.speaker}: ${l.text}`).join("\n");

  return (
    <Modal open={open} onClose={onClose} title="Fulcro Agent" sub={SUB[phase]} width={580}>
      <div style={{ padding: "20px 24px" }}>
        {(phase === "connecting" || phase === "joining") && (
          <div className="py-10 text-center">
            <div className="ai-pulse mx-auto mb-3" />
            <div className="text-[13px] font-medium">{SUB[phase]}</div>
            <div className="t-meta mt-1">
              {phase === "connecting" ? "Google Meet · Zoom · Microsoft Teams" : "Google Meet rilevato"}
            </div>
          </div>
        )}

        {(phase === "live" || phase === "done") && (
          <>
            <div className="flex items-center gap-2 mb-4 pb-4 flex-wrap" style={{ borderBottom: "1px solid var(--line-2)" }}>
              {PARTECIPANTI.map((p) => (
                <span key={p} className="inline-flex items-center gap-1.5">
                  <Avatar name={p} size={22} />
                  <span className="text-[11.5px]" style={{ color: "var(--text-2)" }}>{p}</span>
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 ml-1">
                <span
                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
                  style={{ background: "var(--brand)", color: "#fff" }}
                >
                  FA
                </span>
                <Badge tone="brand" dot>Fulcro Agent · in ascolto, non parla</Badge>
              </span>
            </div>

            <div ref={scrollRef} style={{ maxHeight: 340, overflowY: "auto" }} className="space-y-3 pr-1">
              {SCRIPT.slice(0, revealed).map((l, i) => (
                <div key={i} className="flex gap-2.5">
                  <Avatar name={l.speaker} size={22} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-semibold">{l.speaker}</div>
                    <div className="text-[12.5px] leading-relaxed mt-0.5" style={{ color: "var(--text-2)" }}>{l.text}</div>
                  </div>
                </div>
              ))}
              {phase === "live" && (
                <div className="flex items-center gap-2 t-meta">
                  <span className="ai-pulse" /> trascrizione in corso…
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {phase === "done" && (
        <div
          className="flex justify-end gap-2"
          style={{ padding: "14px 24px", borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          <button className="btn btn-ghost" onClick={onClose}>Annulla</button>
          <button
            className="btn btn-brand"
            onClick={() => { onTranscriptReady(transcriptText); onClose(); }}
          >
            Usa questa trascrizione
          </button>
        </div>
      )}
    </Modal>
  );
}

