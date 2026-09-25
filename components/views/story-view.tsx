"use client";

import type { PregnancyStory } from "@/lib/types";
import { usePlanner } from "../planner-provider";
import { Field, PageHeader } from "../ui";

type GoalKey = "healthGoals" | "birthGoals" | "wellbeingGoals" | "practicalGoals" | "homeGoals" | "postpartumGoals";

const goals: { key: GoalKey; label: string; hint: string }[] = [
  { key: "healthGoals", label: "Briga o zdravlju", hint: "Šetnje, pregledi, lagana prehrana…" },
  { key: "birthGoals", label: "Priprema za porod", hint: "Rodilište, torba, podrška…" },
  { key: "wellbeingGoals", label: "Mentalno blagostanje", hint: "Opuštanje, knjiga, druženje…" },
  { key: "practicalGoals", label: "Praktični ciljevi", hint: "Financije i osnovne potrepštine…" },
  { key: "homeGoals", label: "Prilagodba doma", hint: "Soba za bebu i organizacija prostora…" },
  { key: "postpartumGoals", label: "Priprema za postporođajno razdoblje", hint: "Obroci, pomoć i oporavak…" },
];

export function StoryView() {
  const { state, update } = usePlanner();
  const story = state.story;
  const set = <K extends keyof PregnancyStory>(key: K, value: PregnancyStory[K]) => update((current) => ({ ...current, story: { ...current.story, [key]: value } }));
  const setListItem = (key: "advice" | "compliments", index: number, value: string) => set(key, story[key].map((item, itemIndex) => itemIndex === index ? value : item));

  return <div className="page story-page">
    <PageHeader eyebrow="Tvoja obitelj i važni datumi" title="Moja priča" description="Mjesto za datume, male prekretnice i riječi koje želiš sačuvati." />
    <div className="story-grid">
      <section className="card story-section story-intro">
        <div className="section-head"><div><p className="eyebrow">Osnovni podaci</p><h2>Tvoja obitelj</h2></div></div>
        <div className="form-grid"><div className="two-fields"><Field label="Ime majke"><input value={state.settings.name} onChange={(e) => update((current) => ({ ...current, settings: { ...current.settings, name: e.target.value } }))}/></Field><Field label="Ime partnera"><input value={story.partnerName} onChange={(e) => set("partnerName", e.target.value)}/></Field></div><Field label="Ime bebe"><input value={story.babyName} onChange={(e) => set("babyName", e.target.value)} placeholder="Ako ste ga već odabrali"/></Field></div>
      </section>
      <section className="card story-section">
        <div className="section-head"><div><p className="eyebrow">Moja trudnoća u trenucima</p><h2>Važni datumi</h2></div></div>
        <div className="milestone-grid">
          <DateField label="Datum zadnje mjesečnice" value={story.lastPeriod} onChange={(value) => set("lastPeriod", value)}/>
          <DateField label="Kada sam doznala da sam trudna" value={story.pregnancyFound} onChange={(value) => set("pregnancyFound", value)}/>
          <DateField label="Prvi ultrazvuk" value={story.firstUltrasound} onChange={(value) => set("firstUltrasound", value)}/>
          <DateField label="Prvi otkucaji srca" value={story.firstHeartbeat} onChange={(value) => set("firstHeartbeat", value)}/>
          <DateField label="Prvi put sam osjetila bebu" value={story.firstMovement} onChange={(value) => set("firstMovement", value)}/>
          <DateField label="Prva kupnja za bebu" value={story.firstBabyPurchase} onChange={(value) => set("firstBabyPurchase", value)}/>
          <DateField label="Priprema sobe za bebu" value={story.nurseryReady} onChange={(value) => set("nurseryReady", value)}/>
          <DateField label="Zadnji ultrazvuk" value={story.lastUltrasound} onChange={(value) => set("lastUltrasound", value)}/>
          <DateField label="Očekivani datum poroda" value={state.settings.dueDate} onChange={(value) => update((current) => ({ ...current, settings: { ...current.settings, dueDate: value } }))}/>
          <DateField label="Datum rođenja bebe" value={story.birthDate} onChange={(value) => set("birthDate", value)}/>
        </div>
      </section>
    </div>

    <section className="card story-section">
      <div className="section-head"><div><p className="eyebrow">Mali i ostvarivi koraci</p><h2>Moj trudnički plan</h2></div></div>
      <div className="goals-grid">{goals.map((goal) => <Field key={goal.key} label={goal.label} hint={goal.hint}><textarea rows={4} value={story[goal.key]} onChange={(e) => set(goal.key, e.target.value)}/></Field>)}</div>
    </section>

    <div className="story-grid memory-grid">
      <ListCard title="Savjeti koje želim zapamtiti" values={story.advice} placeholder="Uvijek slušaj svoje tijelo…" onChange={(index, value) => setListItem("advice", index, value)}/>
      <ListCard title="Najljepši komplimenti" values={story.compliments} placeholder="Riječi koje su me razveselile…" onChange={(index, value) => setListItem("compliments", index, value)}/>
    </div>
    <section className="mantra-card"><p className="eyebrow">Moja rečenica</p><textarea aria-label="Moja rečenica za trudnoću" rows={3} value={story.mantra} onChange={(e) => set("mantra", e.target.value)} placeholder="Napiši rečenicu koju želiš čuti kad ti bude teško."/><p>Može biti ozbiljna, smiješna ili sasvim privatna. Bitno je da zvuči kao ti.</p></section>
  </div>;
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <Field label={label}><input type="date" value={value} onChange={(e) => onChange(e.target.value)}/></Field>; }

function ListCard({ title, values, placeholder, onChange }: { title: string; values: string[]; placeholder: string; onChange: (index: number, value: string) => void }) {
  return <section className="card story-section"><div className="section-head"><h2>{title}</h2></div><div className="memory-list">{values.map((value, index) => <label key={index}><span>{index + 1}</span><input value={value} onChange={(e) => onChange(index, e.target.value)} placeholder={index === 0 ? placeholder : ""}/></label>)}</div></section>;
}
