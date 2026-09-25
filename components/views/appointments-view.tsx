"use client";

import { useMemo, useState } from "react";
import type { Appointment } from "@/lib/types";
import { usePlanner } from "../planner-provider";
import { Icon } from "../icons";
import { Button, EmptyState, Field, Modal, PageHeader } from "../ui";

const emptyAppointment: Appointment = {
  id: "new",
  title: "",
  date: "",
  time: "",
  location: "",
  questions: [],
  notes: "",
  completed: false,
};

export function AppointmentsView() {
  const { state, update } = usePlanner();
  const [editing, setEditing] = useState<Appointment | "new" | null>(null);
  const [feedback, setFeedback] = useState("");
  const todayKey = new Intl.DateTimeFormat("sv-SE").format(new Date());
  const appointments = useMemo(() => [...state.appointments].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return `${a.date}T${a.time || "23:59"}`.localeCompare(`${b.date}T${b.time || "23:59"}`);
  }), [state.appointments]);

  const toggle = (id: string) => update((current) => ({
    ...current,
    appointments: current.appointments.map((item) => item.id === id ? { ...item, completed: !item.completed } : item),
  }));
  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 3000);
  };

  return <div className="page appointments-page">
    <PageHeader eyebrow="Pregledi i dogovori" title="Moji termini" description="Zapiši pregled, pripremi pitanja i po potrebi dodaj termin u svoj kalendar." action={<Button icon="plus" onClick={() => setEditing("new")}>Novi termin</Button>} />
    {feedback && <p className="inline-feedback" role="status"><Icon name="check" size={16}/>{feedback}</p>}
    {appointments.length === 0 ? <section className="card"><EmptyState icon="calendar" title="Još nema termina" text="Dodaj sljedeći pregled ili tečaj i zapiši pitanja koja želiš postaviti." /></section> : <div className="appointment-list">
      {appointments.map((appointment) => <article className={`card appointment-card ${appointment.completed ? "completed" : ""}`} key={appointment.id}>
        <button className="appointment-check" onClick={() => toggle(appointment.id)} aria-label={appointment.completed ? `Vrati termin ${appointment.title}` : `Označi termin ${appointment.title} kao završen`}><Icon name="check" size={17}/></button>
        <div className="appointment-date"><strong>{appointment.date ? dayNumber(appointment.date) : "?"}</strong><span>{appointment.date ? monthLabel(appointment.date) : "bez datuma"}</span></div>
        <button className="appointment-main" onClick={() => setEditing(appointment)}>
          <span className={`appointment-timing ${timingClass(appointment, todayKey)}`}>{timingLabel(appointment, todayKey)}</span>
          <strong>{appointment.title}</strong>
          <span>{[appointment.time, appointment.location].filter(Boolean).join(" · ") || "Dodaj vrijeme ili mjesto"}</span>
        </button>
        <div className="appointment-actions">
          {appointment.date && <button className="calendar-action" onClick={() => { downloadCalendarEvent(appointment); showFeedback("Datoteka za kalendar je preuzeta."); }} aria-label={`Dodaj ${appointment.title} u kalendar`}><Icon name="download" size={17}/><span>Kalendar</span></button>}
          <button onClick={() => setEditing(appointment)} aria-label={`Uredi ${appointment.title}`}><Icon name="edit" size={17}/></button>
        </div>
        {appointment.questions.length > 0 && <details className="appointment-questions"><summary>{appointment.questions.length} {appointment.questions.length === 1 ? "pitanje" : "pitanja"} za pregled</summary><ul>{appointment.questions.map((question) => <li key={question}>{question}</li>)}</ul></details>}
      </article>)}
    </div>}
    <section className="appointment-tip"><Icon name="sparkle"/><div><h3>Prije pregleda</h3><p>Zapiši pitanja čim ih se sjetiš. Na pregledu ih možeš označiti ili dopuniti bilješkama.</p></div></section>
    {editing && <AppointmentModal appointment={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} onSaved={showFeedback} />}
  </div>;
}

function AppointmentModal({ appointment, onClose, onSaved }: { appointment?: Appointment; onClose: () => void; onSaved: (message: string) => void }) {
  const { update } = usePlanner();
  const [draft, setDraft] = useState<Appointment>(appointment ?? emptyAppointment);
  const [questions, setQuestions] = useState((appointment?.questions ?? []).join("\n"));
  const [error, setError] = useState("");
  const patch = <K extends keyof Appointment>(key: K, value: Appointment[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const save = () => {
    if (!draft.title.trim() || !draft.date) {
      setError(!draft.title.trim() ? "Upiši naziv termina." : "Odaberi datum termina.");
      return;
    }
    const next = { ...draft, title: draft.title.trim(), questions: questions.split("\n").map((item) => item.trim()).filter(Boolean), id: appointment?.id ?? `appointment-${Date.now()}` };
    update((current) => ({ ...current, appointments: appointment ? current.appointments.map((item) => item.id === appointment.id ? next : item) : [...current.appointments, next] }));
    onClose();
    onSaved(appointment ? "Promjene termina su spremljene." : "Termin je dodan u planer.");
  };
  const remove = () => {
    if (!appointment) return;
    update((current) => ({ ...current, appointments: current.appointments.filter((item) => item.id !== appointment.id) }));
    onClose();
    onSaved("Termin je izbrisan.");
  };

  return <Modal title={appointment ? "Uredi termin" : "Dodaj termin"} onClose={onClose}>
    <div className="form-grid">
      <Field label="Naziv"><input autoFocus required value={draft.title} onChange={(event) => { patch("title", event.target.value); setError(""); }} placeholder="npr. Kontrolni pregled"/></Field>
      <div className="two-fields"><Field label="Datum"><input required type="date" value={draft.date} onChange={(event) => { patch("date", event.target.value); setError(""); }}/></Field><Field label="Vrijeme"><input type="time" value={draft.time} onChange={(event) => patch("time", event.target.value)}/></Field></div>
      <Field label="Mjesto"><input value={draft.location} onChange={(event) => patch("location", event.target.value)} placeholder="Ordinacija, bolnica ili online"/></Field>
      <Field label="Pitanja" hint="Svako pitanje napiši u novi red"><textarea rows={5} value={questions} onChange={(event) => setQuestions(event.target.value)} placeholder={"Koje nalaze trebam donijeti?\nKada je sljedeća kontrola?"}/></Field>
      <Field label="Bilješke"><textarea rows={3} value={draft.notes} onChange={(event) => patch("notes", event.target.value)} placeholder="Upute, nalazi ili dogovor nakon pregleda"/></Field>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="modal-actions">{appointment && <Button variant="danger" icon="trash" onClick={remove}>Izbriši</Button>}<span/><Button variant="ghost" onClick={onClose}>Odustani</Button><Button onClick={save}>Spremi</Button></div>
  </Modal>;
}

function timingClass(appointment: Appointment, todayKey: string) {
  if (appointment.completed) return "done";
  if (appointment.date < todayKey) return "overdue";
  if (appointment.date === todayKey) return "today";
  return "upcoming";
}

function timingLabel(appointment: Appointment, todayKey: string) {
  if (appointment.completed) return "Završeno";
  if (appointment.date < todayKey) return "Prošao termin";
  if (appointment.date === todayKey) return "Danas";
  return "Nadolazeće";
}

function dayNumber(date: string) {
  return new Intl.DateTimeFormat("hr-HR", { day: "2-digit" }).format(new Date(`${date}T12:00:00`));
}

function monthLabel(date: string) {
  return new Intl.DateTimeFormat("hr-HR", { month: "short" }).format(new Date(`${date}T12:00:00`)).replace(".", "");
}

function downloadCalendarEvent(appointment: Appointment) {
  const start = `${appointment.date.replaceAll("-", "")}${appointment.time ? `T${appointment.time.replace(":", "")}00` : ""}`;
  const end = appointment.time ? addHour(appointment.date, appointment.time) : addDay(appointment.date);
  const details = [...appointment.questions.map((question) => `Pitanje: ${question}`), appointment.notes].filter(Boolean).join("\\n");
  const calendar = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Moj trudnicki planer//HR", "BEGIN:VEVENT", `UID:${appointment.id}@moj-trudnicki-planer`, `DTSTART:${start}`, `DTEND:${end}`, `SUMMARY:${escapeCalendar(appointment.title)}`, `LOCATION:${escapeCalendar(appointment.location)}`, `DESCRIPTION:${escapeCalendar(details)}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${appointment.title.toLocaleLowerCase("hr").replace(/[^a-z0-9čćžšđ]+/gi, "-") || "termin"}.ics`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function addHour(date: string, time: string) {
  const value = new Date(`${date}T${time}:00`);
  value.setHours(value.getHours() + 1);
  return `${value.getFullYear()}${String(value.getMonth() + 1).padStart(2, "0")}${String(value.getDate()).padStart(2, "0")}T${String(value.getHours()).padStart(2, "0")}${String(value.getMinutes()).padStart(2, "0")}00`;
}

function addDay(date: string) {
  const value = new Date(`${date}T12:00:00`);
  value.setDate(value.getDate() + 1);
  return `${value.getFullYear()}${String(value.getMonth() + 1).padStart(2, "0")}${String(value.getDate()).padStart(2, "0")}`;
}

function escapeCalendar(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");
}
