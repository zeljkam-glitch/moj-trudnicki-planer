"use client";

import { useState } from "react";
import { usePlanner } from "../planner-provider";
import { Button, Field } from "../ui";
import { Icon } from "../icons";

export function Onboarding() {
  const { state, update } = usePlanner();
  const [name, setName] = useState(state.settings.name);
  const [dueDate, setDueDate] = useState(state.settings.dueDate);
  const [hospital, setHospital] = useState(state.settings.hospital);

  const finish = () => update((current) => ({ ...current, settings: { ...current.settings, name: name.trim() || "Mama", dueDate, hospital: hospital.trim(), onboardingComplete: true } }));

  return <div className="onboarding-backdrop">
    <section className="onboarding-card">
      <div className="onboarding-copy">
        <span className="welcome-mark"><Icon name="sparkle" size={22} /></span>
        <p className="eyebrow">Dobrodošla</p>
        <h1>Sve pripreme.<br /><em>Na jednom mjestu.</em></h1>
        <p>Vodi popise, prati troškove, složi torbu i pripremi plan poroda svojim tempom.</p>
        <div className="privacy-note"><Icon name="heart" size={18} /><span><strong>Privatno po dizajnu</strong>Sve se sprema samo na ovom uređaju.</span></div>
      </div>
      <form className="onboarding-form" onSubmit={(event) => { event.preventDefault(); finish(); }}>
        <div><p className="step-label">Postavljanje planera</p><h2>Za početak nam trebaju tri podatka</h2><p>Sve možeš promijeniti kasnije.</p></div>
        <Field label="Kako da te zovemo?"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tvoje ime" autoFocus /></Field>
        <Field label="Kada ti je termin?"><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required /></Field>
        <Field label="Odabrano rodilište" hint="Nije obavezno"><input value={hospital} onChange={(e) => setHospital(e.target.value)} placeholder="Još nisam odlučila" /></Field>
        <Button type="submit">Otvori moj planer <Icon name="arrow" size={18} /></Button>
        <button type="button" className="demo-link" onClick={finish}>Samo želim razgledati demo</button>
      </form>
    </section>
  </div>;
}
