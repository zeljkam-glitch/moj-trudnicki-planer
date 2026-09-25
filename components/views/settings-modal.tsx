"use client";

import { useRef, useState, type ChangeEvent } from "react";
import type { PlannerState, Settings } from "@/lib/types";
import { usePlanner } from "../planner-provider";
import { Button, Field, Modal } from "../ui";

type BackupEnvelope = {
  app: "moj-trudnicki-planer";
  version: 2;
  exportedAt: string;
  state: PlannerState;
};

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { state, update, replace, reset } = usePlanner();
  const [draft, setDraft] = useState<Settings>(state.settings);
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const saveProfile = () => {
    update((current) => ({ ...current, settings: { ...draft, onboardingComplete: true } }));
    setMessage("Postavke su spremljene.");
  };

  const downloadBackup = () => {
    const backup: BackupEnvelope = { app: "moj-trudnicki-planer", version: 2, exportedAt: new Date().toISOString(), state };
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `moj-trudnicki-planer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Sigurnosna kopija je preuzeta.");
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      const candidate = readBackupState(parsed);
      replace(candidate);
      setDraft({ ...state.settings, ...candidate.settings });
      setMessage("Sigurnosna kopija je uspješno vraćena.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Datoteku nije moguće uvesti.");
    }
  };

  const resetAll = () => {
    if (!window.confirm("Želiš li izbrisati sve svoje unose i vratiti početni planer? Ovu radnju nije moguće poništiti.")) return;
    reset();
    setDraft({ ...state.settings, name: "", dueDate: "", hospital: "", plannerMode: "essential", onboardingComplete: true });
    setMessage("Planer je vraćen na početne podatke.");
  };

  return <Modal title="Postavke i podaci" onClose={onClose} wide>
    <div className="settings-layout">
      <section className="settings-section">
        <p className="eyebrow">Tvoj profil</p>
        <div className="form-grid">
          <Field label="Ime"><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Kako želiš da ti se obraćamo?" /></Field>
          <div className="two-fields"><Field label="Termin poroda"><input type="date" value={draft.dueDate} onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })} /></Field><Field label="Rodilište"><input value={draft.hospital} onChange={(event) => setDraft({ ...draft, hospital: event.target.value })} placeholder="Odabrano ili željeno rodilište" /></Field></div>
          <div className="toggle-grid"><label className="toggle-row"><input type="checkbox" checked={draft.firstPregnancy} onChange={(event) => setDraft({ ...draft, firstPregnancy: event.target.checked })}/><span/><strong>Ovo mi je prva trudnoća</strong></label><label className="toggle-row"><input type="checkbox" checked={draft.trackExpenses} onChange={(event) => setDraft({ ...draft, trackExpenses: event.target.checked })}/><span/><strong>Želim pratiti troškove</strong></label></div>
          <Field label="Prikaz priprema" hint="Osnovni prikaz skriva korisne i kasnije stavke, ali ih ne briše."><select value={draft.plannerMode} onChange={(event) => setDraft({ ...draft, plannerMode: event.target.value as Settings["plannerMode"] })}><option value="essential">Osnovne stavke</option><option value="complete">Potpuni popis</option></select></Field>
          <Button onClick={saveProfile}>Spremi postavke</Button>
        </div>
      </section>
      <section className="settings-section data-section">
        <p className="eyebrow">Sigurnost podataka</p>
        <h3>Preuzmi sigurnosnu kopiju</h3>
        <p>Podaci ostaju u ovom pregledniku. Preuzmi kopiju ako ih želiš sačuvati prije promjene uređaja ili brisanja podataka preglednika.</p>
        <div className="data-actions"><Button variant="secondary" icon="download" onClick={downloadBackup}>Preuzmi kopiju</Button><Button variant="secondary" icon="upload" onClick={() => fileInput.current?.click()}>Vrati iz kopije</Button><input ref={fileInput} className="visually-hidden" type="file" accept="application/json,.json" onChange={importBackup}/></div>
        <div className="danger-zone"><div><strong>Vrati početni planer</strong><small>Briše sve tvoje unose, označene stavke i troškove.</small></div><Button variant="danger" onClick={resetAll}>Izbriši moje podatke</Button></div>
      </section>
    </div>
    <p className="settings-status" aria-live="polite">{message}</p>
    <div className="modal-actions"><span/><Button variant="ghost" onClick={onClose}>Zatvori</Button></div>
  </Modal>;
}

function readBackupState(value: unknown): Partial<PlannerState> {
  if (!value || typeof value !== "object") throw new Error("Datoteka nije valjana sigurnosna kopija.");
  const record = value as Record<string, unknown>;
  const candidate = (record.app === "moj-trudnicki-planer" ? record.state : value) as Record<string, unknown> | undefined;
  const preparationsValid = Array.isArray(candidate?.preparations) && candidate.preparations.every((item) => isRecord(item) && typeof item.name === "string" && (item.group === "mama" || item.group === "beba"));
  const bagsValid = Array.isArray(candidate?.bagItems) && candidate.bagItems.every((item) => isRecord(item) && typeof item.name === "string" && typeof item.bag === "string");
  const expensesValid = Array.isArray(candidate?.expenses) && candidate.expenses.every((item) => isRecord(item) && typeof item.name === "string");
  if (!candidate || typeof candidate !== "object" || !isRecord(candidate.settings) || !preparationsValid || !bagsValid || !expensesValid || !isRecord(candidate.birthPlan) || !Array.isArray(candidate.adminTasks)) {
    throw new Error("Datoteka ne sadrži podatke planera.");
  }
  return candidate as unknown as Partial<PlannerState>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
