"use client";

import { Icon, type IconName } from "./icons";
import type { AppSection } from "@/lib/types";
import { usePlanner } from "./planner-provider";

const primaryNav: { id: AppSection; label: string; short: string; icon: IconName }[] = [
  { id: "today", label: "Danas", short: "Danas", icon: "home" },
  { id: "preparations", label: "Pripreme", short: "Pripreme", icon: "list" },
  { id: "appointments", label: "Termini", short: "Termini", icon: "calendar" },
  { id: "bag", label: "Torba za rodilište", short: "Torba", icon: "bag" },
  { id: "more", label: "Više", short: "Više", icon: "more" },
];

const extraNav: { id: AppSection; label: string; icon: IconName }[] = [
  { id: "hospital", label: "Za polazak", icon: "bag" },
  { id: "birth-plan", label: "Plan poroda", icon: "heart" },
  { id: "expenses", label: "Troškovi", icon: "wallet" },
  { id: "after-birth", label: "Nakon poroda", icon: "file" },
  { id: "story", label: "Moja priča", icon: "heart" },
  { id: "education", label: "Knjige i tečajevi", icon: "list" },
  { id: "notes", label: "Bilješke", icon: "edit" },
];

export function AppShell({ section, onNavigate, children }: { section: AppSection; onNavigate: (section: AppSection) => void; children: React.ReactNode }) {
  const { state } = usePlanner();
  const firstName = state.settings.name.trim().split(" ")[0] || "ti";
  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => onNavigate("today")} aria-label="Početna">
        <span className="brand-mark"><span /></span>
        <span><strong>Moj trudnički</strong><small>planer</small></span>
      </button>
      <nav className="side-nav" aria-label="Glavna navigacija">
        {primaryNav.slice(0, 4).map((item) => <NavButton key={item.id} item={item} active={section === item.id} onClick={() => onNavigate(item.id)} />)}
        <p className="nav-label">Planiranje</p>
        {extraNav.map((item) => <NavButton key={item.id} item={{ ...item, short: item.label }} active={section === item.id} onClick={() => onNavigate(item.id)} />)}
      </nav>
      <div className="sidebar-note"><Icon name="sparkle" size={18} /><p><strong>{state.settings.demoMode ? "Pregled primjera" : "Sve se sprema automatski"}</strong><span>{state.settings.demoMode ? "Promjene u primjeru se ne spremaju." : "Podaci ostaju na ovom uređaju."}</span></p></div>
      <button className="profile-row" onClick={() => onNavigate("more")}><span className="avatar">{firstName.charAt(0).toUpperCase()}</span><span><strong>{firstName}</strong><small>{state.settings.dueDate ? `Termin ${formatShortDate(state.settings.dueDate)}` : "Dodaj termin"}</small></span><Icon name="settings" size={17}/></button>
    </aside>
    <header className="mobile-topbar">
      <button className="mobile-brand" onClick={() => onNavigate("today")} aria-label="Početna">
        <span className="brand-mark"><span /></span>
        <span>Moj planer</span>
      </button>
      <span className="avatar">{firstName.charAt(0).toUpperCase()}</span>
    </header>
    <main className="main-content">{children}</main>
    <nav className="bottom-nav" aria-label="Mobilna navigacija">
      {primaryNav.map((item) => <button key={item.id} className={section === item.id || (item.id === "bag" && section === "hospital") || (item.id === "more" && ["birth-plan", "story", "expenses", "education", "after-birth", "notes"].includes(section)) ? "active" : ""} onClick={() => onNavigate(item.id)}><Icon name={item.icon} size={21} /><span>{item.short}</span></button>)}
    </nav>
  </div>;
}

function NavButton({ item, active, onClick }: { item: { label: string; icon: IconName; short?: string }; active: boolean; onClick: () => void }) {
  return <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}><Icon name={item.icon} size={19} /><span>{item.label}</span></button>;
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("hr-HR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}
