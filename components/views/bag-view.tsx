"use client";

import { useState } from "react";
import { usePlanner } from "../planner-provider";
import { Button, Field, Modal, PageHeader } from "../ui";
import { Icon } from "../icons";
import { ProgressRing } from "../progress-ring";

const bagOrder = ["Prijem", "Rađaona", "Mama", "Beba", "Pratnja", "Za izlazak"];
const bagDescriptions: Record<string, string> = {
  Prijem: "Dokumenti i ono što ti treba odmah", Rađaona: "Male stvari nadohvat ruke", Mama: "Za boravak na odjelu", Beba: "Osnovno za bebu u bolnici", Pratnja: "Da podrška ostane spremna", "Za izlazak": "Pratnja donosi kasnije",
};

export function BagView() {
  const { state, update } = usePlanner();
  const [openBag, setOpenBag] = useState("Prijem");
  const [adding, setAdding] = useState(false);
  const packed = state.bagItems.filter((item) => item.packed).length;
  const progress = Math.round((packed / state.bagItems.length) * 100);
  const departureItems = departureChecklist.map((name) => state.bagItems.find((item) => item.name === name)).filter((item): item is NonNullable<typeof item> => Boolean(item));

  const toggle = (id: string) => update((current) => ({ ...current, bagItems: current.bagItems.map((item) => item.id === id ? { ...item, packed: !item.packed } : item) }));

  return <div className="page bag-page">
    <PageHeader eyebrow="Popis po torbama" title="Torba za rodilište" description="Označi što je spakirano i odmah provjeri u kojoj se torbi nalazi." action={<Button icon="plus" onClick={() => setAdding(true)}>Dodaj stvar</Button>} />
    <section className="bag-summary card"><ProgressRing value={progress} size={118} label="spremno"/><div><p className="eyebrow">Ukupno</p><h2>{packed === state.bagItems.length ? "Sve je spakirano" : packedSummary(packed)}</h2><p>Otvori jednu torbu i nastavi tamo gdje si stala.</p><div className="linear-progress"><span style={{ width: `${progress}%` }}/></div></div><span className="bag-art"><Icon name="bag" size={58}/></span></section>

    <div className="bag-layout">
      <div className="bag-tabs">{bagOrder.map((bag) => {
        const items = state.bagItems.filter((item) => item.bag === bag);
        const done = items.filter((item) => item.packed).length;
        return <button className={openBag === bag ? "active" : ""} key={bag} onClick={() => setOpenBag(bag)}><span className="bag-tab-icon"><Icon name={bag === "Beba" ? "baby" : bag === "Pratnja" ? "user" : "bag"} size={19}/></span><span><strong>{bag}</strong><small>{bagDescriptions[bag]}</small></span><em>{done}/{items.length}</em><Icon name="chevron" size={18}/></button>;
      })}</div>
      <section className="card bag-checklist"><div className="group-head"><div><p className="eyebrow">Torba</p><h2>{openBag}</h2><p>{bagDescriptions[openBag]}</p></div><span>{state.bagItems.filter((i) => i.bag === openBag && i.packed).length}/{state.bagItems.filter((i) => i.bag === openBag).length}</span></div>
        <div className="checklist">{state.bagItems.filter((item) => item.bag === openBag).map((item) => <label key={item.id} className={item.packed ? "checked" : ""}><input type="checkbox" checked={item.packed} onChange={() => toggle(item.id)} /><span className="custom-check"><Icon name="check" size={15}/></span><strong>{item.name}</strong>{item.custom && <button type="button" className="delete-inline" onClick={(e) => { e.preventDefault(); update((current) => ({ ...current, bagItems: current.bagItems.filter((candidate) => candidate.id !== item.id) })); }}><Icon name="trash" size={15}/></button>}</label>)}</div>
      </section>
    </div>
    {departureItems.length > 0 && <section className="card departure-check"><div className="section-head"><div><p className="eyebrow">Brza provjera</p><h2>Prije polaska</h2></div><strong>{departureItems.filter((item) => item.packed).length}/{departureItems.length}</strong></div><p>Najvažnije stvari provjeri još jednom prije odlaska.</p><div>{departureItems.map((item) => <label className={item.packed ? "checked" : ""} key={item.id}><input type="checkbox" checked={item.packed} onChange={() => toggle(item.id)}/><span className="custom-check"><Icon name="check" size={14}/></span><strong>{item.name}</strong><small>{item.bag}</small></label>)}</div></section>}
    <p className="medical-note"><Icon name="sparkle" size={17}/> Provjeri posebne zahtjeve svog rodilišta prije konačnog pakiranja.</p>
    {adding && <AddBagItem defaultBag={openBag} onClose={() => setAdding(false)} />}
  </div>;
}

const departureChecklist = [
  "Dokumenti: osobna, zdravstvena, nalazi, plan poroda i potvrda krvne grupe",
  "Mobitel",
  "Dugi kabel za punjenje",
  "Autosjedalica ili jaje",
];

function packedSummary(value: number) {
  const lastTwo = value % 100;
  const last = value % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return `${value} stavki je spakirano`;
  if (last === 1) return `${value} stavka je spakirana`;
  if (last >= 2 && last <= 4) return `${value} stavke su spakirane`;
  return `${value} stavki je spakirano`;
}

function AddBagItem({ defaultBag, onClose }: { defaultBag: string; onClose: () => void }) {
  const { update } = usePlanner();
  const [name, setName] = useState("");
  const [bag, setBag] = useState(defaultBag);
  const save = () => { if (!name.trim()) return; update((current) => ({ ...current, bagItems: [...current.bagItems, { id: `bag-${Date.now()}`, name: name.trim(), bag, packed: false, custom: true }] })); onClose(); };
  return <Modal title="Dodaj stvar u torbu" onClose={onClose}><div className="form-grid"><Field label="Što želiš spakirati?"><input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="npr. Omiljena krema" /></Field><Field label="U koju torbu?"><select value={bag} onChange={(e) => setBag(e.target.value)}>{bagOrder.map((item) => <option key={item}>{item}</option>)}</select></Field></div><div className="modal-actions"><span/><Button variant="ghost" onClick={onClose}>Odustani</Button><Button onClick={save}>Dodaj</Button></div></Modal>;
}
