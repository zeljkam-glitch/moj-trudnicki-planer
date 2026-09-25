"use client";

import type { AppSection, MoodValue, PlannerMode, PreparationItem, TaskOwner } from "@/lib/types";
import { usePlanner } from "../planner-provider";
import { Icon } from "../icons";
import { ProgressRing } from "../progress-ring";
import { Button } from "../ui";

const moodOptions: { value: MoodValue; label: string; emoji: string }[] = [
  { value: "calm", label: "Mirno", emoji: "◡" },
  { value: "good", label: "Dobro", emoji: "✦" },
  { value: "tired", label: "Umorno", emoji: "☾" },
  { value: "worried", label: "Zabrinuto", emoji: "~" },
  { value: "rest", label: "Treba mi odmor", emoji: "○" },
];

const timelineMilestones: { from: number; to: number; label: string; text: string; section: AppSection }[] = [
  { from: 1, to: 13, label: "Postavi temelje", text: "Termin, pitanja i osnovne bilješke", section: "appointments" },
  { from: 14, to: 23, label: "Planiraj bez žurbe", text: "Istraži što ti stvarno treba", section: "education" },
  { from: 24, to: 29, label: "Osnovne pripreme", text: "Odaberi najvažnije za mamu i bebu", section: "preparations" },
  { from: 30, to: 33, label: "Plan poroda", text: "Zapiši želje i pitanja za razgovor", section: "birth-plan" },
  { from: 34, to: 36, label: "Torba i dokumenti", text: "Spakiraj ono što želiš imati pri ruci", section: "hospital" },
  { from: 37, to: 40, label: "Spremno za polazak", text: "Kontakti, torba i plan na jednom mjestu", section: "hospital" },
];

export function TodayView({ onNavigate }: { onNavigate: (section: AppSection) => void }) {
  const { state, update } = usePlanner();
  const { week, daysToGo } = pregnancyProgress(state.settings.dueDate);
  const actionable = rankActionable(state.preparations, week, state.settings.plannerMode).slice(0, 3);
  const todayKey = new Intl.DateTimeFormat("sv-SE").format(new Date());
  const nextAppointment = [...state.appointments].filter((item) => !item.completed && item.date >= todayKey).sort((a, b) => a.date.localeCompare(b.date))[0];
  const visiblePreparations = state.preparations.filter((item) => state.settings.plannerMode === "complete" || item.priority === "essential" || item.custom);
  const completed = visiblePreparations.filter((item) => item.status === "bought" || item.status === "gift" || item.status === "skip").length;
  const prepProgress = visiblePreparations.length ? Math.round((completed / visiblePreparations.length) * 100) : 0;
  const packed = state.bagItems.filter((item) => item.packed).length;
  const bagProgress = Math.round((packed / state.bagItems.length) * 100);
  const firstName = state.settings.name.trim().split(" ")[0] || "mama";
  const todayLabel = new Intl.DateTimeFormat("hr-HR", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;
  const weekMessage = weekContent(week);
  const todayMood = state.moodEntries.find((entry) => entry.date === todayKey)?.mood;
  const moodSupport = todayMood ? moodGuidance(todayMood) : null;

  const markBought = (item: PreparationItem) => update((current) => ({ ...current, preparations: current.preparations.map((candidate) => candidate.id === item.id ? { ...candidate, status: "bought" } : candidate) }));
  const saveMood = (mood: MoodValue) => update((current) => ({
    ...current,
    moodEntries: [{ date: todayKey, mood }, ...current.moodEntries.filter((entry) => entry.date !== todayKey)].slice(0, 90),
  }));

  return <div className="page today-page">
    <header className="today-heading"><div><p className="eyebrow">{todayLabel}</p><h1>Bok, {firstName}.</h1><p>Odaberi što želiš riješiti danas.</p></div><span className="sun-shape" aria-hidden="true" /></header>

    <section className="pregnancy-hero">
      <div className="hero-copy">
        <span className="hero-kicker"><Icon name="calendar" size={16} /> {trimester}. tromjesečje</span>
        <p className="week-number"><strong>{week}.</strong> tjedan</p>
        <div className="week-focus"><span>Fokus ovog tjedna</span><strong>{weekMessage.title}</strong><p>{weekMessage.text}</p></div>
        <div className="week-track"><span style={{ width: `${Math.min(100, (week / 40) * 100)}%` }} /></div>
        <div className="week-ends"><span>{week} tjedana završeno</span><span>Termin {formatDate(state.settings.dueDate)}</span></div>
      </div>
      <div className="pregnancy-stage" aria-label={`${week}. tjedan trudnoće, još ${daysToGo} dana do termina`}>
        <div className="stage-orbit"><span className="orbit-dot one"/><span className="orbit-dot two"/><div><small>Tjedan</small><strong>{week}</strong><span>od 40</span></div></div>
        <div className="stage-metrics"><span><small>Preostalo</small><strong>{Math.max(0, 40 - week)} tj.</strong></span><span><small>Do termina</small><strong>{daysToGo} dana</strong></span></div>
      </div>
    </section>

    <button className="hospital-quick-card" onClick={() => onNavigate("hospital")}><span className="hospital-quick-icon"><Icon name="bag" size={22}/></span><span><small>{week >= 34 ? "Brza provjera za polazak" : "Pripremi unaprijed"}</small><strong>Režim za rodilište</strong><em>Dokumenti, kontakti, torba i Plan poroda</em></span><span>Otvori <Icon name="arrow" size={15}/></span></button>

    <section className="card pregnancy-timeline">
      <div className="section-head"><div><p className="eyebrow">Tvoj ritam</p><h2>Plan trudnoće po razdobljima</h2></div><span>{week}. tjedan</span></div>
      <p className="timeline-intro">Ovo je organizacijski okvir, ne medicinski raspored. Prilagodi ga sebi i uputama svog liječnika.</p>
      <div className="timeline-track">{timelineMilestones.map((milestone) => {
        const stateName = week > milestone.to ? "done" : week >= milestone.from ? "current" : "upcoming";
        return <button key={milestone.from} className={stateName} onClick={() => onNavigate(milestone.section)}>
          <span className="timeline-step-head"><span>{stateName === "done" ? <Icon name="check" size={13}/> : milestone.from}</span><small>{milestone.from} do {milestone.to}. tjedna</small></span>
          <strong>{milestone.label}</strong><em>{milestone.text}</em>
        </button>;
      })}</div>
    </section>

    <section className="card mood-card">
      <div className="mood-copy"><p className="eyebrow">Kratka provjera</p><h2>Kako si danas?</h2><p>Odaberi kako se osjećaš. Nema bodovanja ni procjene zdravlja.</p></div>
      <div className="mood-options" role="group" aria-label="Kako se danas osjećaš">{moodOptions.map((option) => <button key={option.value} className={todayMood === option.value ? "selected" : ""} aria-pressed={todayMood === option.value} onClick={() => saveMood(option.value)}><span>{option.emoji}</span>{option.label}</button>)}</div>
      {moodSupport && <div className="mood-response" role="status"><span className="mini-icon"><Icon name="heart" size={18}/></span><p><strong>{moodSupport.title}</strong><span>{moodSupport.text}</span></p>{moodSupport.section && <button onClick={() => onNavigate(moodSupport.section!)}>{moodSupport.action}<Icon name="arrow" size={15}/></button>}</div>}
    </section>

    <div className="today-grid">
      <section className="card tasks-card">
        <div className="section-head"><div><p className="eyebrow">Tvoj kratki popis</p><h2>Što sada ima smisla riješiti</h2></div><button className="text-link" onClick={() => onNavigate("preparations")}>Sve pripreme <Icon name="arrow" size={16}/></button></div>
        <div className="task-list">
          {actionable.map(({ item, reason }) => <label className="task-row" key={item.id}><input type="checkbox" onChange={() => markBought(item)} /><span className="custom-check"><Icon name="check" size={15}/></span><span><strong>{item.name}</strong><small>{reason}{item.owner && item.owner !== "me" ? ` · ${ownerLabel(item.owner)}` : ""}</small></span><span className={`priority-dot ${item.priority}`} /></label>)}
          {actionable.length === 0 && <div className="tasks-empty"><Icon name="check" size={20}/><p>Osnovne stavke su riješene. Potpuni popis možeš otvoriti u pripremama.</p></div>}
        </div>
        <Button variant="secondary" icon="plus" onClick={() => onNavigate("preparations")}>Otvori pripreme</Button>
      </section>

      <aside className="dashboard-aside">
        <button className="card progress-card" onClick={() => onNavigate("preparations")}><ProgressRing value={prepProgress} size={96} label="spremno"/><span><small>Pripreme</small><strong>{completed} stavki riješeno</strong><em>od {visiblePreparations.length} u {state.settings.plannerMode === "essential" ? "osnovnom" : "potpunom"} popisu</em></span><Icon name="chevron" /></button>
        <button className="card mini-card bag-mini" onClick={() => onNavigate("bag")}><span className="mini-icon"><Icon name="bag" /></span><span><small>Torba za rodilište</small><strong>{bagProgress}% spremna</strong><em>{packed} od {state.bagItems.length} spakirano</em></span><Icon name="chevron" /></button>
        <button className="card mini-card appointment-mini" onClick={() => onNavigate("appointments")}><span className="mini-icon"><Icon name="calendar" /></span><span><small>Sljedeći termin</small><strong>{nextAppointment ? nextAppointment.title : "Dodaj pregled ili tečaj"}</strong><em>{nextAppointment ? formatAppointment(nextAppointment.date, nextAppointment.time) : "Pripremi pitanja na jednom mjestu"}</em></span><Icon name="chevron" /></button>
        <button className="card mini-card plan-mini" onClick={() => onNavigate("birth-plan")}><span className="mini-icon"><Icon name="heart" /></span><span><small>Plan poroda</small><strong>Pregledaj ili dopuni plan</strong><em>Spreman je i za ispis</em></span><Icon name="chevron" /></button>
      </aside>
    </div>

    <section className="gentle-note"><span>&quot;</span><p>Ne moraš riješiti sve odjednom. Odaberi ono što ti je danas najvažnije.</p></section>
  </div>;
}

function rankActionable(items: PreparationItem[], week: number, mode: PlannerMode) {
  const priorityScore = { essential: 0, useful: 1, later: 2 };
  const preferredPhase = week >= 34 ? "hospital" : "before";
  return items.filter((item) => !["bought", "gift", "skip"].includes(item.status) && (mode === "complete" || item.priority === "essential" || item.custom)).toSorted((a, b) => {
    const phaseDifference = Number(!a.phases?.includes(preferredPhase)) - Number(!b.phases?.includes(preferredPhase));
    if (phaseDifference !== 0) return phaseDifference;
    const priorityDifference = priorityScore[a.priority] - priorityScore[b.priority];
    if (priorityDifference !== 0) return priorityDifference;
    return Number(a.status !== "planned") - Number(b.status !== "planned");
  }).map((item) => ({ item, reason: taskReason(item, week) }));
}

function taskReason(item: PreparationItem, week: number) {
  if (item.owner === "partner") return "Dogovoreno za partnera";
  if (item.owner === "together") return "Dogovoreno da riješite zajedno";
  if (item.phases?.includes("hospital") && week >= 34) return "Pripremi prije odlaska u rodilište";
  if (item.phases?.includes("hospital") && week >= 28) return "Dobro je pripremiti prije 34. tjedna";
  if (item.status === "planned") return "Već je u tvom planu";
  if (item.priority === "essential") return "Osnovna stavka za ovu fazu";
  return item.category;
}

function weekContent(week: number) {
  if (week <= 13) return { title: "Polako postavi temelje", text: "Zapiši termine i pitanja, a velike kupnje još mogu pričekati." };
  if (week <= 27) return { title: "Pripreme bez žurbe", text: "Sada je dobro vrijeme za osnovnu opremu, tečajeve i prve odluke." };
  if (week <= 33) return { title: "Pretvori ideje u plan", text: "Provjeri rodilište, složi Plan poroda i počni pripremati torbu." };
  if (week <= 37) return { title: "Dovrši ono najvažnije", text: "Dokumenti, torba i dogovor s pratnjom sada imaju prednost." };
  return { title: "Sve važno neka bude pri ruci", text: "Provjeri dokumente i torbu, a ostatak vremena sačuvaj za sebe." };
}

function moodGuidance(mood: MoodValue): { title: string; text: string; action?: string; section?: AppSection } {
  if (mood === "worried") return { title: "Ne moraš sve držati u glavi.", text: "Zapiši pitanje za sljedeći pregled, makar bilo sasvim kratko.", action: "Otvori termine", section: "appointments" };
  if (mood === "tired") return { title: "Skrati današnji popis.", text: "Odaberi jednu malu obavezu. Ostalo može pričekati.", action: "Pogledaj kratki popis", section: "preparations" };
  if (mood === "rest") return { title: "Odmor je također dio pripreme.", text: "Danas je dovoljno provjeriti ono što je već riješeno." };
  if (mood === "good") return { title: "Iskoristi dobar dan po svom.", text: "Ako ti se da, riješi jednu pripremu koja će ti kasnije olakšati posao.", action: "Otvori pripreme", section: "preparations" };
  return { title: "Zadrži ovaj miran tempo.", text: "Odaberi jednu stvar koja ti danas djeluje lagano." };
}

function ownerLabel(owner: TaskOwner) {
  return owner === "partner" ? "Partner" : owner === "together" ? "Zajedno" : "Ja";
}

function formatAppointment(date: string, time: string) {
  const label = new Intl.DateTimeFormat("hr-HR", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00`));
  return time ? `${label} u ${time}` : label;
}

function pregnancyProgress(dueDate: string) {
  const due = new Date(`${dueDate}T12:00:00`);
  const today = new Date();
  const daysToGo = Math.max(0, Math.ceil((due.getTime() - today.getTime()) / 86400000));
  return { week: Math.max(1, Math.min(40, Math.floor((280 - daysToGo) / 7))), daysToGo };
}

function formatDate(value: string) {
  if (!value) return "nije postavljen";
  return new Intl.DateTimeFormat("hr-HR", { day: "numeric", month: "long" }).format(new Date(`${value}T12:00:00`));
}
