"use client";

import { useState } from "react";
import { usePlanner } from "../planner-provider";
import { Button, Field, Modal, PageHeader } from "../ui";
import { Icon } from "../icons";

export function NotesView() {
  const { state, update } = usePlanner();
  const [adding, setAdding] = useState(false);
  const patch = (id: string, field: "title" | "body", value: string) => update((current) => ({ ...current, notes: current.notes.map((note) => note.id === id ? { ...note, [field]: value, updatedAt: new Date().toISOString() } : note) }));
  const remove = (id: string) => update((current) => ({ ...current, notes: current.notes.filter((note) => note.id !== id) }));

  return <div className="page notes-page"><PageHeader eyebrow="Sve što ne stane na popis" title="Moje bilješke" description="Zapiši pitanja za pregled, dogovore, ideje ili nešto što ne želiš zaboraviti." action={<Button icon="plus" onClick={() => setAdding(true)}>Nova bilješka</Button>}/><div className="notes-grid">{state.notes.map((note) => <article className="card note-card" key={note.id}><input className="note-title" value={note.title} onChange={(e) => patch(note.id, "title", e.target.value)} aria-label="Naslov bilješke"/><textarea value={note.body} onChange={(e) => patch(note.id, "body", e.target.value)} placeholder="Piši kako ti odgovara. Bilješku možeš urediti kasnije." aria-label={`Sadržaj bilješke ${note.title}`}/><button onClick={() => remove(note.id)} aria-label={`Izbriši ${note.title}`}><Icon name="trash" size={16}/></button></article>)}</div><section className="notes-quote"><span>&quot;</span><p>Ne moraš pamtiti baš sve. Zato postoji ova stranica.</p></section>{adding && <AddNote onClose={() => setAdding(false)}/>}</div>;
}

function AddNote({ onClose }: { onClose: () => void }) {
  const { update } = usePlanner();
  const [title, setTitle] = useState("");
  const save = () => { const clean = title.trim() || "Nova bilješka"; update((current) => ({ ...current, notes: [...current.notes, { id: `note-${Date.now()}`, title: clean, body: "", updatedAt: new Date().toISOString() }] })); onClose(); };
  return <Modal title="Nova bilješka" onClose={onClose}><Field label="Naslov"><input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="npr. Pitanja za ginekologa"/></Field><div className="modal-actions"><span/><Button variant="ghost" onClick={onClose}>Odustani</Button><Button onClick={save}>Dodaj</Button></div></Modal>;
}
