"use client";

import type { AppSection } from "@/lib/types";
import { usePlanner } from "../planner-provider";
import { Icon } from "../icons";
import { Button, Field, PageHeader } from "../ui";
import { ProgressRing } from "../progress-ring";

const criticalItemNames = [
  "Dokumenti: osobna, zdravstvena, nalazi, plan poroda i potvrda krvne grupe",
  "Mobitel",
  "Dugi kabel za punjenje",
  "Autosjedalica ili jaje",
];

export function HospitalModeView({ onNavigate }: { onNavigate: (section: AppSection) => void }) {
  const { state, update } = usePlanner();
  const criticalItems = criticalItemNames.map((name) => state.bagItems.find((item) => item.name === name)).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const packedCritical = criticalItems.filter((item) => item.packed).length;
  const contactChecks = [state.settings.hospital, state.settings.hospitalAddress, state.settings.hospitalPhone, state.birthPlan.supportPerson, state.settings.supportPhone];
  const completedContacts = contactChecks.filter((value) => value.trim()).length;
  const planReady = Boolean(state.birthPlan.fullName && (state.birthPlan.hospital || state.settings.hospital) && state.birthPlan.supportPerson);
  const completed = packedCritical + completedContacts + Number(planReady);
  const total = criticalItems.length + contactChecks.length + 1;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  const toggleBagItem = (id: string) => update((current) => ({
    ...current,
    bagItems: current.bagItems.map((item) => item.id === id ? { ...item, packed: !item.packed } : item),
  }));
  const setSetting = (key: "hospital" | "hospitalAddress" | "hospitalPhone" | "supportPhone", value: string) => update((current) => ({
    ...current,
    settings: { ...current.settings, [key]: value },
    birthPlan: key === "hospital" ? { ...current.birthPlan, hospital: value } : current.birthPlan,
  }));
  const setSupportPerson = (value: string) => update((current) => ({ ...current, birthPlan: { ...current.birthPlan, supportPerson: value } }));

  return <div className="page hospital-mode-page">
    <PageHeader eyebrow="Sve za polazak" title="Režim za rodilište" description="Najvažnije informacije i stvari na jednom mjestu. Prije polaska slijedi upute svog rodilišta." action={<Button variant="secondary" icon="bag" onClick={() => onNavigate("bag")}>Otvori cijelu torbu</Button>} />

    <section className="hospital-readiness">
      <div className="hospital-readiness-copy"><span className="hero-kicker"><Icon name="sparkle" size={16}/> Brza provjera</span><h2>{progress === 100 ? "Sve s ovog popisa je spremno" : "Provjeri prije nego zatreba"}</h2><p>Ovaj ekran ne mijenja upute liječnika ili rodilišta. Služi da ti važne stvari budu pri ruci.</p><div className="linear-progress"><span style={{ width: `${progress}%` }}/></div><small>{completed} od {total} provjera je riješeno</small></div>
      <ProgressRing value={progress} size={112} label="spremno" />
    </section>

    <div className="hospital-mode-grid">
      <section className="card hospital-checklist">
        <div className="section-head"><div><p className="eyebrow">Najvažnije stvari</p><h2>Prije polaska</h2></div><strong>{packedCritical}/{criticalItems.length}</strong></div>
        <div className="hospital-critical-list">{criticalItems.map((item) => <label className={item.packed ? "checked" : ""} key={item.id}><input type="checkbox" checked={item.packed} onChange={() => toggleBagItem(item.id)}/><span className="custom-check"><Icon name="check" size={14}/></span><span><strong>{item.name}</strong><small>{item.bag}</small></span></label>)}</div>
        <button className="text-link" onClick={() => onNavigate("bag")}>Pogledaj sve torbe <Icon name="arrow" size={15}/></button>
      </section>

      <section className="card hospital-contacts">
        <div><p className="eyebrow">Kontakti i lokacija</p><h2>Sve što želiš imati pri ruci</h2></div>
        <div className="form-grid">
          <Field label="Rodilište"><input value={state.settings.hospital} onChange={(event) => setSetting("hospital", event.target.value)} placeholder="Naziv rodilišta"/></Field>
          <Field label="Adresa"><input value={state.settings.hospitalAddress} onChange={(event) => setSetting("hospitalAddress", event.target.value)} placeholder="Adresa rodilišta"/></Field>
          <Field label="Telefon rodilišta"><input type="tel" value={state.settings.hospitalPhone} onChange={(event) => setSetting("hospitalPhone", event.target.value)} placeholder="Broj koji si dobila od rodilišta"/></Field>
          <div className="two-fields"><Field label="Pratnja"><input value={state.birthPlan.supportPerson} onChange={(event) => setSupportPerson(event.target.value)} placeholder="Ime osobe"/></Field><Field label="Telefon pratnje"><input type="tel" value={state.settings.supportPhone} onChange={(event) => setSetting("supportPhone", event.target.value)} placeholder="Broj telefona"/></Field></div>
        </div>
        <div className="contact-actions">{state.settings.hospitalPhone && <a href={`tel:${phoneValue(state.settings.hospitalPhone)}`}><Icon name="calendar" size={16}/> Nazovi rodilište</a>}{state.settings.supportPhone && <a href={`tel:${phoneValue(state.settings.supportPhone)}`}><Icon name="user" size={16}/> Nazovi pratnju</a>}</div>
      </section>
    </div>

    <section className="hospital-shortcuts">
      <button className="card" onClick={() => onNavigate("birth-plan")}><span className="mini-icon"><Icon name="heart"/></span><span><small>Plan poroda</small><strong>{planReady ? "Osnovni podaci su upisani" : "Dopuni osnovne podatke"}</strong><em>Pregledaj želje ili pripremi ispis</em></span><Icon name="chevron"/></button>
      <button className="card" onClick={() => onNavigate("appointments")}><span className="mini-icon"><Icon name="calendar"/></span><span><small>Termini i pitanja</small><strong>Bilješke za sljedeći razgovor</strong><em>Sve što želiš pitati medicinski tim</em></span><Icon name="chevron"/></button>
      <button className="card" onClick={() => onNavigate("preparations")}><span className="mini-icon"><Icon name="list"/></span><span><small>Pripreme</small><strong>Provjeri što još čeka</strong><em>Uključi filter za bolnicu</em></span><Icon name="chevron"/></button>
    </section>
  </div>;
}

function phoneValue(value: string) {
  return value.replace(/[^\d+]/g, "");
}
