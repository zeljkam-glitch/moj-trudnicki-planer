"use client";

import { usePlanner } from "../planner-provider";
import { Button, Field, Modal, PageHeader } from "../ui";
import { Icon } from "../icons";
import { useState } from "react";

export function AfterBirthView() {
  const { state, update } = usePlanner();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const done = state.adminTasks.filter((task) => task.completed).length;
  const toggle = (id: string) => update((current) => ({ ...current, adminTasks: current.adminTasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task) }));

  return <div className="page after-page">
    <PageHeader eyebrow="Dokumenti i rokovi" title="Nakon poroda" description="Označi što je riješeno i prije predaje provjeri aktualne upute nadležne službe." action={<Button variant="secondary" icon="edit" onClick={() => setSettingsOpen(true)}>Moji podaci</Button>} />
    <section className="after-hero"><div><span className="hero-kicker"><Icon name="file" size={16}/> Administracija</span><h2>{done === state.adminTasks.length ? "Sve je riješeno." : "Nastavi od prve neriješene obveze."}</h2><p>{done} od {state.adminTasks.length} obveza je označeno kao gotovo.</p><div className="linear-progress"><span style={{ width: `${done / state.adminTasks.length * 100}%` }}/></div></div><span className="after-art"><Icon name="sparkle" size={40}/></span></section>
    <div className="admin-layout"><section className="card admin-list"><div className="group-head"><div><p className="eyebrow">Tvoj popis</p><h2>Što treba riješiti</h2></div><span>{done}/{state.adminTasks.length}</span></div>{state.adminTasks.map((task, index) => <div className={`admin-task ${task.completed ? "completed" : ""}`} key={task.id}><input type="checkbox" aria-label={`Riješeno: ${task.name}`} checked={task.completed} onChange={() => toggle(task.id)}/><span className="custom-check" aria-hidden="true"><Icon name="check" size={15}/></span><span className="task-number">{String(index + 1).padStart(2, "0")}</span><span><strong>{task.name}</strong><small>{task.description}</small>{task.sourceUrl && <a href={task.sourceUrl} target="_blank" rel="noopener noreferrer">Službene upute ↗</a>}</span><em><Icon name="clock" size={14}/>{task.deadline}</em></div>)}</section><aside><section className="card admin-warning"><Icon name="sparkle"/><h3>Prije slanja zahtjeva</h3><p>Izvori i rokovi provjereni 28. 9. 2026. za stavke s poveznicom. Za lokalne naknade provjeri svoju općinu ili grad; okolnosti mogu promijeniti postupak.</p></section></aside></div>
    {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
  </div>;
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  const { state, update } = usePlanner();
  const [draft, setDraft] = useState(state.settings);
  const save = () => { update((current) => ({ ...current, settings: draft })); onClose(); };
  return <Modal title="Moji podaci" onClose={onClose}><div className="form-grid"><Field label="Ime"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}/></Field><Field label="Termin poroda"><input type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}/></Field><Field label="Odabrano rodilište"><input value={draft.hospital} onChange={(e) => setDraft({ ...draft, hospital: e.target.value })}/></Field></div><div className="modal-actions"><span/><Button variant="ghost" onClick={onClose}>Odustani</Button><Button onClick={save}>Spremi</Button></div></Modal>;
}
