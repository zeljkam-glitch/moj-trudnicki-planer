"use client";

import { useState } from "react";

import type { AppSection } from "@/lib/types";
import { Icon, type IconName } from "../icons";
import { PageHeader } from "../ui";
import { SettingsModal } from "./settings-modal";

const sections: { id: AppSection; title: string; text: string; icon: IconName }[] = [
  { id: "hospital", title: "Za polazak", text: "Dokumenti, torba, kontakti i Plan poroda na jednom mjestu", icon: "bag" },
  { id: "birth-plan", title: "Plan poroda", text: "Želje, napomene i verzija za ispis", icon: "heart" },
  { id: "expenses", title: "Troškovi", text: "Planirano, plaćeno, pokloni i ušteda", icon: "wallet" },
  { id: "after-birth", title: "Nakon poroda", text: "Administracija, rokovi i službene provjere", icon: "file" },
  { id: "story", title: "Moja priča", text: "Obitelj, datumi, ciljevi i uspomene", icon: "heart" },
  { id: "education", title: "Knjige i tečajevi", text: "Čitanje, edukacije i prijave", icon: "list" },
  { id: "notes", title: "Bilješke", text: "Slobodan prostor za misli i inspiraciju", icon: "edit" },
];

export function MoreView({ onNavigate }: { onNavigate: (section: AppSection) => void }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  return <div className="page more-page"><PageHeader eyebrow="Cijeli planer" title="Još sadržaja" description="Plan poroda, troškovi, administracija, edukacije i osobne bilješke."/><div className="more-grid">{sections.map((section) => <button className="card more-card" key={section.id} onClick={() => onNavigate(section.id)}><span className="mini-icon"><Icon name={section.icon}/></span><span><strong>{section.title}</strong><small>{section.text}</small></span><Icon name="chevron"/></button>)}<button className="card more-card" onClick={() => setSettingsOpen(true)}><span className="mini-icon"><Icon name="settings"/></span><span><strong>Postavke i podaci</strong><small>Profil, način prikaza i sigurnosna kopija</small></span><Icon name="chevron"/></button></div><section className="card about-planner"><p className="eyebrow">O planeru</p><h2>Napravi ga svojim</h2><p>Ovdje možeš voditi popise, zapisivati troškove, pripremiti torbu i sastaviti plan poroda. Slobodno preskoči ono što ti ne treba i dodaj vlastite stavke.</p><p>Planer nije test koji moraš dovršiti. Treba ti pomoći da manje toga držiš u glavi i lakše vidiš što je sljedeće.</p><footer><strong>Ivana Cerovac</strong><span>Planer je nastao iz osobnog iskustva majčinstva i rada u organizaciji i komunikacijama.</span><small>© 2025. Ivana Cerovac. Sadržaj je zaštićen autorskim pravom.</small></footer></section>{settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)}/>}</div>;
}
