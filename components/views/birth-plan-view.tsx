"use client";

import { useState } from "react";
import type { BirthPlan } from "@/lib/types";
import { usePlanner } from "../planner-provider";
import { Button, Field, PageHeader } from "../ui";
import { Icon } from "../icons";
import { ProgressRing } from "../progress-ring";

const atmosphereOptions = ["Prigušeno svjetlo", "Glazba", "Tišina", "Što manje ljudi"];
const decisionOptions = ["", "Da", "Ne", "Želim razgovarati o tome", "Razgovarati prije odluke", "Samo ako je medicinski potrebno"];

export function BirthPlanView() {
  const { state, update } = usePlanner();
  const [step, setStep] = useState(0);
  const plan = state.birthPlan;
  const set = <K extends keyof BirthPlan>(key: K, value: BirthPlan[K]) => update((current) => ({ ...current, birthPlan: { ...current.birthPlan, [key]: value } }));
  const toggleAtmosphere = (option: string) => set("atmosphere", plan.atmosphere.includes(option) ? plan.atmosphere.filter((item) => item !== option) : [...plan.atmosphere, option]);
  const sections = birthPlanSections(plan);
  const completedSections = sections.filter((section) => section.complete).length;
  const completion = Math.round((completedSections / sections.length) * 100);
  const goToStep = (nextStep: number) => {
    setStep(Math.max(0, Math.min(sections.length - 1, nextStep)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <div className="page birth-plan-page">
    <PageHeader eyebrow="Priprema za razgovor" title="Plan poroda" description="Zapiši svoje želje pa ih prođi s pratnjom i medicinskim timom. Plan se može promijeniti ako situacija to traži." action={<Button icon="print" onClick={() => window.print()}>Ispiši plan</Button>} />
    <section className="card plan-wizard-head"><div><p className="eyebrow">Korak {step + 1} od {sections.length}</p><h2>{sections[step].label}</h2><p>{step === 0 ? "Počni s informacijama koje timu trebaju odmah." : step === 1 ? "Dodaj samo ono što je važno da medicinski tim zna." : step === 2 ? "Odaberi atmosferu i podršku koja bi ti odgovarala." : step === 3 ? "Zabilježi preferencije o kojima želiš razgovarati." : "Sažmi svoje želje za prve trenutke s bebom."}</p></div><div className="wizard-track" aria-label={`${completion}% plana je ispunjeno`}><span style={{ width: `${((step + 1) / sections.length) * 100}%` }}/></div></section>
    <div className="plan-layout">
      <div className="plan-form">
        {step === 0 && <PlanSection id="birth-plan-01" number="01" title="Osnovni podaci" description="Informacije koje timu trebaju odmah.">
          <div className="two-fields"><Field label="Ime i prezime"><input value={plan.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder={state.settings.name || "Tvoje ime"}/></Field><Field label="Termin poroda"><input type="date" value={state.settings.dueDate} onChange={(e) => update((current) => ({ ...current, settings: { ...current.settings, dueDate: e.target.value } }))}/></Field></div>
          <div className="two-fields"><Field label="Rodilište"><input value={plan.hospital} onChange={(e) => set("hospital", e.target.value)} placeholder={state.settings.hospital || "Odabrano rodilište"}/></Field><Field label="Pratnja"><input value={plan.supportPerson} onChange={(e) => set("supportPerson", e.target.value)} placeholder="Ime i odnos"/></Field></div>
        </PlanSection>}
        {step === 1 && <PlanSection id="birth-plan-02" number="02" title="Zdravstvene informacije" description="Kratko i samo ono što je važno.">
          <Field label="Alergije"><input value={plan.allergies} onChange={(e) => set("allergies", e.target.value)} placeholder="Ako ih nema, napiši Nema"/></Field>
          <Field label="Terapije ili lijekovi"><input value={plan.therapy} onChange={(e) => set("therapy", e.target.value)} placeholder="Ako ih nema, napiši Nema"/></Field>
          <Field label="Posebni zahtjevi ili strahovi"><textarea rows={3} value={plan.fears} onChange={(e) => set("fears", e.target.value)} placeholder="Što želiš da tim zna?"/></Field>
        </PlanSection>}
        {step === 2 && <PlanSection id="birth-plan-03" number="03" title="Tijekom poroda" description="Atmosfera i podrška koja bi ti odgovarala.">
          <Field label="Željena atmosfera"><div className="choice-chips">{atmosphereOptions.map((option) => <button type="button" className={plan.atmosphere.includes(option) ? "selected" : ""} key={option} onClick={() => toggleAtmosphere(option)}>{plan.atmosphere.includes(option) && <Icon name="check" size={15}/>} {option}</button>)}</div></Field>
          <Field label="Kretanje i položaji"><textarea rows={3} value={plan.positions} onChange={(e) => set("positions", e.target.value)}/></Field>
        </PlanSection>}
        {step === 3 && <PlanSection id="birth-plan-04" number="04" title="Medicinske intervencije" description="Zabilježi preferencije, a odluke donesi s medicinskim timom.">
          <div className="decision-grid"><Decision label="Indukcija" value={plan.induction} onChange={(value) => set("induction", value)}/><Decision label="Epiduralna" value={plan.epidural} onChange={(value) => set("epidural", value)}/><Decision label="Epiziotomija" value={plan.episiotomy} onChange={(value) => set("episiotomy", value)}/></div>
          <Field label="Ako bude potreban carski rez"><textarea rows={3} value={plan.cesarean} onChange={(e) => set("cesarean", e.target.value)}/></Field>
        </PlanSection>}
        {step === 4 && <PlanSection id="birth-plan-05" number="05" title="Nakon poroda" description="Prvi trenuci s bebom.">
          <div className="toggle-grid"><Toggle label="Skin-to-skin, ako je moguće" checked={plan.skinToSkin} onChange={(value) => set("skinToSkin", value)}/><Toggle label="Dojenje odmah, ako je moguće" checked={plan.breastfeeding} onChange={(value) => set("breastfeeding", value)}/><Toggle label="Prvi pregled bebe uz mamu, ako je moguće" checked={plan.babyExamWithMother} onChange={(value) => set("babyExamWithMother", value)}/></div>
          <div className="two-fields"><Field label="Pupkovina"><input value={plan.cord} onChange={(e) => set("cord", e.target.value)}/></Field><Field label="Smještaj bebe"><input value={plan.roomingIn} onChange={(e) => set("roomingIn", e.target.value)}/></Field></div>
          <Field label="Fotografiranje i prvi trenuci"><input value={plan.photos} onChange={(e) => set("photos", e.target.value)}/></Field>
          <Field label="Dodatne želje i napomene"><textarea rows={5} value={plan.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Dodaj ono što još želiš reći timu."/></Field>
        </PlanSection>}
        <div className="wizard-actions"><Button variant="ghost" onClick={() => goToStep(step - 1)} disabled={step === 0}>Natrag</Button><span>Promjene se spremaju automatski</span>{step < sections.length - 1 ? <Button onClick={() => goToStep(step + 1)}>Sljedeći korak</Button> : <Button icon="print" onClick={() => window.print()}>Pregledaj za ispis</Button>}</div>
      </div>
      <aside className="plan-aside"><section className="card plan-progress"><ProgressRing value={completion} size={82} label="ispunjeno"/><div><p className="eyebrow">Napredak plana</p><strong>{completedSections} od {sections.length} cjelina</strong></div><nav aria-label="Dijelovi plana poroda">{sections.map((section, index) => <button className={step === index ? "active" : ""} key={section.id} onClick={() => goToStep(index)}><span className={section.complete ? "complete" : ""}>{section.complete ? <Icon name="check" size={13}/> : index + 1}</span>{section.label}</button>)}</nav></section><section className="card plan-tip"><span className="mini-icon"><Icon name="heart"/></span><h3>Plan je početak razgovora.</h3><p>Porod je nepredvidiv. Podijeli plan s pratnjom i razgovaraj o njemu s medicinskim timom.</p></section><div className="autosave"><span className="save-dot"/><p><strong>Automatski spremljeno</strong><small>Promjene ostaju na ovom uređaju.</small></p></div></aside>
    </div>
    <PrintablePlan plan={plan} dueDate={state.settings.dueDate} fallbackName={state.settings.name} />
  </div>;
}

function PlanSection({ id, number, title, description, children }: { id: string; number: string; title: string; description: string; children: React.ReactNode }) { return <section className="card plan-section" id={id}><div className="plan-section-head"><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div></div><div className="form-grid">{children}</div></section>; }
function Decision({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <Field label={label}><select value={value} onChange={(e) => onChange(e.target.value)}>{decisionOptions.map((option) => <option key={option} value={option}>{option || "Još nisam odlučila"}</option>)}</select></Field>; }
function Toggle({ label, checked, onChange }: { label: string; checked: boolean | null; onChange: (value: boolean | null) => void }) { return <Field label={label}><select value={checked === null ? "" : String(checked)} onChange={(e) => onChange(e.target.value === "" ? null : e.target.value === "true")}><option value="">Još nisam odlučila</option><option value="true">Da, ako je moguće</option><option value="false">Ne</option></select></Field>; }
function PrintablePlan({ plan, dueDate, fallbackName }: { plan: BirthPlan; dueDate: string; fallbackName: string }) {
  const empty = "Nije uneseno";
  const answer = (value: boolean | null) => value === null ? "Nije odlučeno" : value ? "Da, ako je moguće" : "Ne";
  return <article className="print-plan">
    <header><p>MOJ TRUDNIČKI PLANER</p><h1>Moj plan poroda</h1><span>Ovaj dokument sažima moje želje i služi kao podrška razgovoru s medicinskim timom.</span></header>
    <div className="print-meta"><p><small>Ime i prezime</small>{plan.fullName || fallbackName || empty}</p><p><small>Termin</small>{dueDate ? new Intl.DateTimeFormat("hr-HR").format(new Date(`${dueDate}T12:00:00`)) : empty}</p><p><small>Rodilište</small>{plan.hospital || empty}</p><p><small>Pratnja</small>{plan.supportPerson || empty}</p></div>
    <PrintSection title="Zdravstvene informacije"><p><b>Alergije:</b> {plan.allergies || empty}</p><p><b>Terapije ili lijekovi:</b> {plan.therapy || empty}</p><p><b>Posebni zahtjevi ili strahovi:</b> {plan.fears || empty}</p></PrintSection>
    <PrintSection title="Tijekom poroda"><p><b>Atmosfera:</b> {plan.atmosphere.join(", ") || empty}</p><p><b>Kretanje i položaji:</b> {plan.positions || empty}</p></PrintSection>
    <PrintSection title="Intervencije"><p>Indukcija: {plan.induction || empty}</p><p>Epiduralna: {plan.epidural || empty}</p><p>Epiziotomija: {plan.episiotomy || empty}</p><p><b>Carski rez:</b> {plan.cesarean || empty}</p></PrintSection>
    <PrintSection title="Nakon poroda"><p>Kontakt koža na kožu: {answer(plan.skinToSkin)}</p><p>Dojenje odmah: {answer(plan.breastfeeding)}</p><p>Prvi pregled bebe uz mamu: {answer(plan.babyExamWithMother)}</p><p><b>Pupkovina:</b> {plan.cord || empty}</p><p><b>Smještaj bebe:</b> {plan.roomingIn || empty}</p><p><b>Fotografiranje i prvi trenuci:</b> {plan.photos || empty}</p></PrintSection>
    {plan.notes && <PrintSection title="Dodatne napomene"><p>{plan.notes}</p></PrintSection>}
    <footer>Hvala što ste odvojili vrijeme za razgovor o mojim željama.</footer>
  </article>;
}
function PrintSection({ title, children }: { title: string; children: React.ReactNode }) { return <section><h2>{title}</h2>{children}</section>; }

function birthPlanSections(plan: BirthPlan) {
  return [
    { id: "birth-plan-01", label: "Osnovni podaci", complete: Boolean(plan.fullName && plan.hospital && plan.supportPerson) },
    { id: "birth-plan-02", label: "Zdravstvene informacije", complete: Boolean(plan.allergies || plan.therapy || plan.fears) },
    { id: "birth-plan-03", label: "Tijekom poroda", complete: Boolean(plan.atmosphere.length && plan.positions) },
    { id: "birth-plan-04", label: "Medicinske intervencije", complete: Boolean(plan.induction && plan.epidural && plan.episiotomy && plan.cesarean) },
    { id: "birth-plan-05", label: "Nakon poroda", complete: Boolean(plan.cord && plan.roomingIn && plan.photos) },
  ];
}
