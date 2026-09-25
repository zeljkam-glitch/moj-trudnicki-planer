"use client";

import { useState } from "react";
import type { CourseItem, ReadingItem } from "@/lib/types";
import { usePlanner } from "../planner-provider";
import { Button, Field, Modal, PageHeader } from "../ui";
import { Icon } from "../icons";

export function EducationView() {
  const { state, update } = usePlanner();
  const [modal, setModal] = useState<"book" | "course" | null>(null);
  const toggleBook = (id: string) => update((current) => ({ ...current, readingList: current.readingList.map((item) => item.id === id ? { ...item, read: !item.read } : item) }));
  const toggleCourse = (id: string) => update((current) => ({ ...current, courses: current.courses.map((item) => item.id === id ? { ...item, registered: !item.registered } : item) }));
  const removeBook = (id: string) => update((current) => ({ ...current, readingList: current.readingList.filter((item) => item.id !== id) }));
  const removeCourse = (id: string) => update((current) => ({ ...current, courses: current.courses.filter((item) => item.id !== id) }));

  return <div className="page education-page">
    <PageHeader eyebrow="Tvoja lista za učenje" title="Knjige i tečajevi" description="Spremi ono što želiš pročitati ili pohađati. Ostalo slobodno preskoči." />
    <div className="education-grid">
      <section className="card library-card"><div className="group-head"><div><p className="eyebrow">Moja lista za čitanje</p><h2>Knjige o roditeljstvu</h2><p>Praktični izvori za trudnoću, dojenje, razdoblje nakon poroda i prve mjesece.</p></div><Button variant="secondary" icon="plus" onClick={() => setModal("book")}>Dodaj</Button></div><div className="resource-list book-list">{state.readingList.map((book, index) => <div key={book.id} className={`resource-row book-resource-row ${book.read ? "completed" : ""}`}><label><input type="checkbox" checked={book.read} onChange={() => toggleBook(book.id)}/><span className="custom-check"><Icon name="check" size={15}/></span><BookCover book={book} tone={(index % 5) + 1}/><span className="book-copy"><strong>{book.title}</strong><small>{book.author} · {book.topics}</small>{book.isbn && <em>ISBN {book.isbn}</em>}</span></label><div className="resource-actions">{book.url && <a href={book.url} target="_blank" rel="noreferrer" aria-label={`Otvori informacije o knjizi ${book.title}`}>{book.source === "WorldCat" ? "Pronađi" : "Otvori"}<Icon name="arrow" size={14}/></a>}{book.custom && <button className="delete-inline" onClick={() => removeBook(book.id)} aria-label={`Ukloni knjigu ${book.title}`}><Icon name="trash" size={16}/></button>}</div></div>)}</div></section>
      <section className="card library-card"><div className="group-head"><div><p className="eyebrow">Prije i poslije poroda</p><h2>Moji odabrani tečajevi</h2><p>Dom zdravlja, online programi, RODA i privatne radionice.</p></div><Button variant="secondary" icon="plus" onClick={() => setModal("course")}>Dodaj</Button></div><div className="resource-list">{state.courses.map((course) => <div key={course.id} className={`resource-row ${course.registered ? "completed" : ""}`}><label><input type="checkbox" checked={course.registered} onChange={() => toggleCourse(course.id)}/><span className="custom-check"><Icon name="check" size={15}/></span><span><strong>{course.name}</strong><small>{course.location} · {course.duration} · {course.applyBy}</small></span></label>{course.custom && <button className="delete-inline" onClick={() => removeCourse(course.id)} aria-label={`Ukloni tečaj ${course.name}`}><Icon name="trash" size={16}/></button>}</div>)}</div></section>
    </div>
    <section className="education-note"><Icon name="sparkle"/><div><h3>Ne trebaš završiti sve</h3><p>Odaberi jedan izvor za temu koja ti je sada važna. Novu knjigu ili tečaj uvijek možeš dodati kasnije.</p></div></section>
    {modal === "book" && <AddBook onClose={() => setModal(null)}/>}
    {modal === "course" && <AddCourse onClose={() => setModal(null)}/>}
  </div>;
}

function AddBook({ onClose }: { onClose: () => void }) {
  const { update } = usePlanner();
  const [draft, setDraft] = useState<Omit<ReadingItem, "id">>({ title: "", author: "", topics: "", url: "", source: "Moja poveznica", read: false, custom: true });
  const save = () => {
    if (!draft.title.trim()) return;
    update((current) => ({ ...current, readingList: [...current.readingList, { ...draft, url: normalizeUrl(draft.url), id: `book-${Date.now()}` }] }));
    onClose();
  };
  return <Modal title="Dodaj knjigu" onClose={onClose}><div className="form-grid"><Field label="Naslov"><input autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}/></Field><Field label="Autor"><input value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })}/></Field><Field label="Ključne teme"><input value={draft.topics} onChange={(e) => setDraft({ ...draft, topics: e.target.value })}/></Field><Field label="Poveznica, ako je imaš"><input type="url" inputMode="url" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="https://..."/></Field></div><div className="modal-actions"><span/><Button variant="ghost" onClick={onClose}>Odustani</Button><Button onClick={save}>Spremi</Button></div></Modal>;
}

function BookCover({ book, tone }: { book: ReadingItem; tone: number }) {
  return <span className={`book-cover tone-${tone}`} aria-hidden="true"><small>{book.topics || "Moja knjiga"}</small><strong>{shortCoverTitle(book.title)}</strong><em>{book.author || "Moja lista"}</em></span>;
}

function shortCoverTitle(title: string) {
  return title.split(" ").slice(0, 5).join(" ");
}

function normalizeUrl(value?: string) {
  const candidate = value?.trim();
  if (!candidate) return undefined;
  try {
    const url = new URL(/^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function AddCourse({ onClose }: { onClose: () => void }) {
  const { update } = usePlanner();
  const [draft, setDraft] = useState<Omit<CourseItem, "id">>({ name: "", location: "", duration: "", applyBy: "", registered: false, custom: true });
  const save = () => { if (!draft.name.trim()) return; update((current) => ({ ...current, courses: [...current.courses, { ...draft, id: `course-${Date.now()}` }] })); onClose(); };
  return <Modal title="Dodaj tečaj" onClose={onClose}><div className="form-grid"><Field label="Naziv tečaja"><input autoFocus value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}/></Field><div className="two-fields"><Field label="Lokacija / online"><input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })}/></Field><Field label="Trajanje"><input value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })}/></Field></div><Field label="Kada se prijaviti"><input value={draft.applyBy} onChange={(e) => setDraft({ ...draft, applyBy: e.target.value })}/></Field></div><div className="modal-actions"><span/><Button variant="ghost" onClick={onClose}>Odustani</Button><Button onClick={save}>Spremi</Button></div></Modal>;
}
