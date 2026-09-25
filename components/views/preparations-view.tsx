"use client";

import { useMemo, useState } from "react";
import type { ItemStatus, PreparationItem, Priority, TaskOwner } from "@/lib/types";
import { usePlanner } from "../planner-provider";
import { Button, Field, Modal, PageHeader, SearchInput } from "../ui";
import { Icon } from "../icons";
import { categoryGuides } from "@/lib/catalog";

const statuses: { value: ItemStatus; label: string }[] = [
  { value: "need", label: "Trebam" }, { value: "planned", label: "Planiram" }, { value: "bought", label: "Kupljeno" }, { value: "gift", label: "Poklon" }, { value: "skip", label: "Ne treba mi" },
];
const priorities: { value: Priority; label: string }[] = [
  { value: "essential", label: "Osnovno" }, { value: "useful", label: "Korisno" }, { value: "later", label: "Može pričekati" },
];

export function PreparationsView() {
  const { state, update } = usePlanner();
  const [group, setGroup] = useState<"all" | "mama" | "beba">("all");
  const [status, setStatus] = useState<"all" | ItemStatus>("all");
  const [phase, setPhase] = useState<"all" | "before" | "hospital" | "after">("all");
  const [owner, setOwner] = useState<"all" | TaskOwner>("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<PreparationItem | "new" | null>(null);
  const [feedback, setFeedback] = useState("");

  const items = useMemo(() => state.preparations.filter((item) => {
    const matchesQuery = `${item.name} ${item.category}`.toLocaleLowerCase("hr").includes(query.toLocaleLowerCase("hr"));
    const visibleInMode = state.settings.plannerMode === "complete" || item.priority === "essential" || item.custom;
    return visibleInMode && matchesQuery && (group === "all" || item.group === group) && (status === "all" || item.status === status) && (phase === "all" || item.phases?.includes(phase)) && (owner === "all" || (item.owner ?? "me") === owner);
  }), [state.preparations, state.settings.plannerMode, group, status, phase, owner, query]);

  const grouped = Object.entries(items.reduce<Record<string, PreparationItem[]>>((acc, item) => {
    const key = `${item.group === "mama" ? "Za mamu" : "Za bebu"} · ${item.category}`;
    (acc[key] ??= []).push(item);
    return acc;
  }, {}));

  const modeItems = state.preparations.filter((item) => state.settings.plannerMode === "complete" || item.priority === "essential" || item.custom);
  const solved = modeItems.filter((item) => ["bought", "gift", "skip"].includes(item.status)).length;
  const partnerItems = modeItems.filter((item) => item.owner === "partner" && !["bought", "gift", "skip"].includes(item.status));

  const setItemStatus = (item: PreparationItem, next: ItemStatus) => {
    update((current) => ({ ...current, preparations: current.preparations.map((candidate) => candidate.id === item.id ? { ...candidate, status: next } : candidate) }));
  };
  const toggleResolved = (item: PreparationItem) => {
    setItemStatus(item, ["bought", "gift", "skip"].includes(item.status) ? "need" : "bought");
  };
  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 3000);
  };
  const copyPartnerList = async () => {
    const text = ["Partnerov popis iz Mojeg trudničkog planera", ...partnerItems.map((item) => `• ${item.name}${item.quantity ? `, ${item.quantity}` : ""}`)].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      showFeedback("Partnerov popis je kopiran.");
    } catch {
      showFeedback("Kopiranje nije uspjelo. Pokušaj ponovno.");
    }
  };

  return <div className="page">
    <PageHeader eyebrow="Popis za mamu i bebu" title="Moje pripreme" description={`${solved} od ${modeItems.length} prikazanih stavki je riješeno. Preskoči što ti ne treba i dodaj svoje.`} action={<Button icon="plus" onClick={() => setEditing("new")}>Nova stavka</Button>} />
    {feedback && <p className="inline-feedback" role="status"><Icon name="check" size={16}/>{feedback}</p>}
    <div className="planner-mode-bar"><div><strong>{state.settings.plannerMode === "essential" ? "Prikazane su osnovne stavke" : "Prikazan je potpuni popis"}</strong><span>{state.settings.plannerMode === "essential" ? "Vlastite stavke uvijek ostaju vidljive." : "Uključen je i sadržaj koji može pričekati."}</span></div><div className="planner-mode-actions">{partnerItems.length > 0 && <button className="partner-copy" onClick={copyPartnerList}><Icon name="copy" size={16}/>Kopiraj partnerov popis</button>}<div className="segmented" role="group" aria-label="Količina prikazanih stavki"><button className={state.settings.plannerMode === "essential" ? "active" : ""} onClick={() => update((current) => ({ ...current, settings: { ...current.settings, plannerMode: "essential" } }))}>Osnovno</button><button className={state.settings.plannerMode === "complete" ? "active" : ""} onClick={() => update((current) => ({ ...current, settings: { ...current.settings, plannerMode: "complete" } }))}>Sve stavke</button></div></div></div>
    <div className="toolbar">
      <SearchInput placeholder="Pretraži pripreme…" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="segmented" role="group" aria-label="Za koga"><button className={group === "all" ? "active" : ""} onClick={() => setGroup("all")}>Sve</button><button className={group === "mama" ? "active" : ""} onClick={() => setGroup("mama")}>Mama</button><button className={group === "beba" ? "active" : ""} onClick={() => setGroup("beba")}>Beba</button></div>
      <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} aria-label="Filtriraj po statusu"><option value="all">Svi statusi</option>{statuses.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select>
      <select className="filter-select" value={phase} onChange={(e) => setPhase(e.target.value as typeof phase)} aria-label="Filtriraj po razdoblju"><option value="all">Sva razdoblja</option><option value="before">Prije poroda</option><option value="hospital">U bolnici</option><option value="after">Nakon poroda</option></select>
      <select className="filter-select" value={owner} onChange={(e) => setOwner(e.target.value as typeof owner)} aria-label="Filtriraj po osobi"><option value="all">Svi zadaci</option><option value="me">Ja</option><option value="partner">Partner</option><option value="together">Zajedno</option></select>
    </div>
    <div className="legend"><span><i className="priority-dot essential"/> Osnovno</span><span><i className="priority-dot useful"/> Korisno</span><span><i className="priority-dot later"/> Može pričekati</span><span><Icon name="check" size={14}/> Kućica označava stavku kao kupljenu</span></div>
    <div className="quick-guides">
      <details><summary>Veličine bebine odjeće</summary><div className="size-table"><span>50 · 0–1 mj. · do 3,5 kg</span><span>56 · 0–2 mj. · 3–4,5 kg</span><span>62 · 2–3 mj. · 5–6 kg</span><span>68 · 4–6 mj. · 7–8 kg</span><span>74 · 6–9 mj. · 8–9,5 kg</span><span>80 · 9–12 mj. · 9,5–11 kg</span><span>86 · 12–18 mj. · 11–12,5 kg</span><span>92 · 18–24 mj. · 12,5–14 kg</span></div></details>
      <details><summary>Veličina pilates lopte</summary><div className="size-table"><span>do 165 cm → lopta 55 cm</span><span>166–175 cm → lopta 65 cm</span><span>176–185 cm → lopta 75 cm</span><span>preko 185 cm → lopta 85 cm</span></div></details>
      <details><summary>Legenda razdoblja</summary><p>Prije poroda obuhvaća trudničke pripreme; bolnica ono što nosiš u rodilište; nakon poroda oporavak, dojenje i prve dane s bebom.</p></details>
    </div>

    <div className="preparation-groups">
      {grouped.map(([category, categoryItems]) => <section className="card preparation-group" key={category}>
        <div className="group-head"><div><h2>{category}</h2>{categoryGuides[category.replace(/^Za (mamu|bebu) · /, "")] && <p>{categoryGuides[category.replace(/^Za (mamu|bebu) · /, "")]}</p>}</div><span>{categoryItems.filter((item) => ["bought", "gift", "skip"].includes(item.status)).length}/{categoryItems.length}</span></div>
        <div className="preparation-list">{categoryItems.map((item) => <article className="preparation-row" key={item.id}>
          <button className={`status-check status-${item.status}`} onClick={() => toggleResolved(item)} aria-label={["bought", "gift", "skip"].includes(item.status) ? `Vrati ${item.name} među neriješene` : `Označi ${item.name} kao kupljeno`}><Icon name={item.status === "bought" || item.status === "gift" ? "check" : item.status === "skip" ? "close" : "plus"} size={15}/></button>
          <button className="item-main" onClick={() => setEditing(item)}><span><strong>{item.name}</strong><small>{item.quantity}{item.note ? ` · ${item.note}` : ""}{item.owner && item.owner !== "me" ? ` · ${ownerLabel(item.owner)}` : ""}</small></span></button>
          <span className={`priority-pill ${item.priority}`}>{priorities.find((p) => p.value === item.priority)?.label}</span>
          <select className={`status-pill ${item.status}`} value={item.status} onChange={(event) => setItemStatus(item, event.target.value as ItemStatus)} aria-label={`Status za ${item.name}`}>{statuses.map((entry) => <option value={entry.value} key={entry.value}>{entry.label}</option>)}</select>
          <button className="row-edit" onClick={() => setEditing(item)} aria-label={`Uredi ${item.name}`}><Icon name="edit" size={17}/></button>
        </article>)}</div>
      </section>)}
      {!grouped.length && <div className="card empty-search"><Icon name="search"/><h3>Nema pronađenih stavki</h3><p>Pokušaj s drugim pojmom ili ukloni neki filter.</p></div>}
    </div>
    {editing && <PreparationModal item={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} onSaved={showFeedback} />}
  </div>;
}

function PreparationModal({ item, onClose, onSaved }: { item?: PreparationItem; onClose: () => void; onSaved: (message: string) => void }) {
  const { update } = usePlanner();
  const [draft, setDraft] = useState<PreparationItem>(item ?? { id: "new-item", name: "", group: "beba", category: "Ostalo", priority: "useful", status: "need", quantity: "1 kom", plannedCost: 0, paidCost: 0, phases: ["before"], owner: "me", custom: true });
  const patch = <K extends keyof PreparationItem>(key: K, value: PreparationItem[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const save = () => {
    if (!draft.name.trim()) return;
    update((current) => ({ ...current, preparations: item ? current.preparations.map((candidate) => candidate.id === item.id ? draft : candidate) : [...current.preparations, { ...draft, id: `custom-${Date.now()}` }] }));
    onClose();
    onSaved(item ? "Promjene su spremljene." : `Stavka „${draft.name.trim()}” je dodana.`);
  };
  const remove = () => { if (!item) return; update((current) => ({ ...current, preparations: current.preparations.filter((candidate) => candidate.id !== item.id) })); onClose(); onSaved("Stavka je izbrisana."); };

  return <Modal title={item ? "Uredi stavku" : "Dodaj svoju stavku"} onClose={onClose}>
    <div className="form-grid">
      <Field label="Naziv"><input value={draft.name} onChange={(e) => patch("name", e.target.value)} placeholder="npr. Nosiljka" autoFocus /></Field>
      <div className="two-fields"><Field label="Za koga"><select value={draft.group} onChange={(e) => patch("group", e.target.value as PreparationItem["group"])}><option value="mama">Za mamu</option><option value="beba">Za bebu</option></select></Field><Field label="Kategorija"><input value={draft.category} onChange={(e) => patch("category", e.target.value)} /></Field></div>
      <div className="two-fields"><Field label="Prioritet"><select value={draft.priority} onChange={(e) => patch("priority", e.target.value as Priority)}>{priorities.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</select></Field><Field label="Status"><select value={draft.status} onChange={(e) => patch("status", e.target.value as ItemStatus)}>{statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></Field></div>
      <Field label="Tko rješava?"><select value={draft.owner ?? "me"} onChange={(e) => patch("owner", e.target.value as TaskOwner)}><option value="me">Ja</option><option value="partner">Partner</option><option value="together">Zajedno</option></select></Field>
      <Field label="Količina"><input value={draft.quantity ?? ""} onChange={(e) => patch("quantity", e.target.value)} /></Field>
      <div className="two-fields"><Field label="Trgovina"><input value={draft.store ?? ""} onChange={(e) => patch("store", e.target.value)} placeholder="Gdje planiraš kupiti"/></Field><Field label="Mjesec kupnje"><input value={draft.plannedMonth ?? ""} onChange={(e) => patch("plannedMonth", e.target.value)} placeholder="npr. svibanj"/></Field></div>
      <div className="two-fields"><Field label="Planirana cijena / poklon (€)"><input type="number" min="0" value={draft.plannedCost ?? 0} onChange={(e) => patch("plannedCost", Number(e.target.value))}/></Field><Field label="Stvarno plaćeno (€)"><input type="number" min="0" value={draft.paidCost ?? 0} onChange={(e) => patch("paidCost", Number(e.target.value))}/></Field></div>
      <Field label="Bilješka"><textarea rows={3} value={draft.note ?? ""} onChange={(e) => patch("note", e.target.value)} placeholder="Veličina, boja ili nešto što želiš zapamtiti…" /></Field>
    </div>
    <div className="modal-actions">{item && <Button variant="danger" icon="trash" onClick={remove}>Izbriši</Button>}<span/><Button variant="ghost" onClick={onClose}>Odustani</Button><Button onClick={save}>Spremi</Button></div>
  </Modal>;
}

function ownerLabel(owner: TaskOwner) {
  return owner === "partner" ? "Partner" : owner === "together" ? "Zajedno" : "Ja";
}
