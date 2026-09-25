"use client";

import { useState } from "react";
import type { AppSection, Expense } from "@/lib/types";
import { usePlanner } from "../planner-provider";
import { Button, Field, Modal, PageHeader } from "../ui";
import { Icon } from "../icons";

export function ExpensesView({ onNavigate }: { onNavigate: (section: AppSection) => void }) {
  const { state, update } = usePlanner();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const preparationExpenses: Expense[] = state.preparations.filter((item) => (item.plannedCost ?? 0) > 0 || (item.paidCost ?? 0) > 0).map((item) => ({ id: `prep:${item.id}`, name: item.name, category: item.category, planned: item.plannedCost ?? 0, paid: item.paidCost ?? 0, isGift: item.status === "gift" }));
  const explicitNames = new Set(state.expenses.map((item) => normalizeName(item.name)));
  const allExpenses = dedupeExpenses([...state.expenses, ...preparationExpenses.filter((item) => !explicitNames.has(normalizeName(item.name)))]);
  const planned = allExpenses.reduce((sum, item) => sum + item.planned, 0);
  const paid = allExpenses.reduce((sum, item) => sum + item.paid, 0);
  const gifts = allExpenses.filter((item) => item.isGift).reduce((sum, item) => sum + item.planned, 0);
  const remaining = Math.max(0, planned - paid - gifts);
  const saved = allExpenses.filter((item) => !item.isGift && item.paid > 0).reduce((sum, item) => sum + Math.max(0, item.planned - item.paid), 0);
  const max = Math.max(planned, 1);

  const remove = (id: string) => update((current) => id.startsWith("prep:") ? { ...current, preparations: current.preparations.map((item) => item.id === id.slice(5) ? { ...item, plannedCost: 0, paidCost: 0 } : item) } : { ...current, expenses: current.expenses.filter((item) => item.id !== id) });

  return <div className="page expenses-page">
    <PageHeader eyebrow="Pregled bez Excela" title="Troškovi" description="Prati planirano, stvarno plaćeno i ono što ste dobili na poklon." action={<Button icon="plus" onClick={() => setAdding(true)}>Dodaj trošak</Button>} />
    <div className="expense-stats"><StatCard label="Planirano" value={planned} tone="sand" icon="calendar"/><StatCard label="Plaćeno" value={paid} tone="clay" icon="wallet"/><StatCard label="Pokloni" value={gifts} tone="sage" icon="heart"/><StatCard label="Preostalo" value={remaining} tone="ink" icon="sparkle"/></div>
    <div className="expenses-grid">
      <section className="card spending-card"><div className="section-head"><div><p className="eyebrow">Pregled plana</p><h2>Gdje je tvoj budžet</h2></div><strong>{formatMoney(paid)} / {formatMoney(planned)}</strong></div><div className="budget-bar" aria-label="Raspodjela budžeta"><span className="paid" style={{ width: `${Math.min(100, paid / max * 100)}%` }}/><span className="gift" style={{ width: `${Math.max(0, Math.min(100 - paid / max * 100, gifts / max * 100))}%` }}/></div><div className="budget-legend"><span><i className="paid"/>Plaćeno</span><span><i className="gift"/>Pokloni</span><span><i className="remaining"/>Preostalo</span></div>
        <div className="expense-table"><div className="expense-table-head"><span>Stavka</span><span>Planirano</span><span>Plaćeno</span><span /></div>{allExpenses.map((item) => <div className="expense-row" key={item.id}><button className="expense-name" onClick={() => setEditing(item)}><strong>{item.name}</strong><small>{item.category}{item.isGift ? " · Poklon" : ""}</small></button><span>{formatMoney(item.planned)}</span><span>{item.isGift ? "Poklon" : formatMoney(item.paid)}</span><button onClick={() => remove(item.id)} aria-label={`Ukloni trošak ${item.name}`}><Icon name="trash" size={16}/></button></div>)}</div>
      </section>
      <aside className="expense-aside"><section className="card insight-card"><span className="mini-icon"><Icon name="sparkle" /></span><p className="eyebrow">Trenutačno stanje</p><h3>{remaining > 0 ? "Još ima prostora u planu." : "Plan je trenutačno pokriven."}</h3><p>{saved > 0 ? <>Na završenim kupnjama platili ste <strong>{formatMoney(saved)}</strong> manje od plana.</> : <>Uštedu ćemo prikazati nakon prvih završenih kupnji.</>}</p></section><section className="card budget-tips"><h3>Prije kupnje</h3><ul><li>Provjeri možeš li nešto posuditi ili sigurno kupiti rabljeno.</li><li>U plan ubroji dostavu, baterije i potrošni materijal.</li><li>Ostavi dio budžeta za preglede, lijekove i neplanirane kupnje.</li><li>Zapiši naknade i poklone kako ih ne bi računala dvaput.</li><li>Podijeli listu želja s bliskim ljudima da izbjegnete duplikate.</li></ul></section><button className="card admin-link" onClick={() => onNavigate("after-birth")}><span className="mini-icon"><Icon name="file" /></span><span><small>Nakon poroda</small><strong>Administrativni popis</strong><em>10 obveza i pripadajući rokovi</em></span><Icon name="arrow" /></button></aside>
    </div>
    {adding && <AddExpense onClose={() => setAdding(false)} />}
    {editing && <AddExpense expense={editing} onClose={() => setEditing(null)} />}
  </div>;
}

function StatCard({ label, value, tone, icon }: { label: string; value: number; tone: string; icon: "calendar" | "wallet" | "heart" | "sparkle" }) { return <article className={`stat-card ${tone}`}><span><Icon name={icon} size={18}/></span><small>{label}</small><strong>{formatMoney(value)}</strong></article>; }

function AddExpense({ onClose, expense }: { onClose: () => void; expense?: Expense }) {
  const { update } = usePlanner();
  const [draft, setDraft] = useState<Omit<Expense, "id">>(expense ? { name: expense.name, category: expense.category, planned: expense.planned, paid: expense.paid, isGift: expense.isGift } : { name: "", category: "Ostalo", planned: 0, paid: 0, isGift: false });
  const preparationItem = expense?.id.startsWith("prep:");
  const save = () => { if (!draft.name.trim()) return; update((current) => preparationItem && expense ? { ...current, preparations: current.preparations.map((item) => item.id === expense.id.slice(5) ? { ...item, plannedCost: draft.planned, paidCost: draft.isGift ? 0 : draft.paid, status: draft.isGift ? "gift" : item.status === "gift" ? "planned" : item.status } : item) } : expense ? { ...current, expenses: current.expenses.map((item) => item.id === expense.id ? { ...draft, id: item.id } : item) } : { ...current, expenses: [...current.expenses, { ...draft, id: `expense-${Date.now()}` }] }); onClose(); };
  return <Modal title={expense ? "Uredi trošak" : "Dodaj trošak"} onClose={onClose}><div className="form-grid"><Field label="Naziv"><input autoFocus value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="npr. Autosjedalica" disabled={preparationItem} /></Field><Field label="Kategorija"><input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} disabled={preparationItem} /></Field><div className="two-fields"><Field label="Planirano (€)"><input type="number" min="0" value={draft.planned} onChange={(e) => setDraft({ ...draft, planned: Number(e.target.value) })} /></Field><Field label="Plaćeno (€)"><input type="number" min="0" value={draft.paid} onChange={(e) => setDraft({ ...draft, paid: Number(e.target.value) })} disabled={draft.isGift} /></Field></div><label className="toggle-row"><input type="checkbox" checked={draft.isGift} onChange={(e) => setDraft({ ...draft, isGift: e.target.checked, paid: e.target.checked ? 0 : draft.paid })}/><span/><strong>Ovo smo dobili na poklon</strong></label></div><div className="modal-actions"><span/><Button variant="ghost" onClick={onClose}>Odustani</Button><Button onClick={save}>Spremi</Button></div></Modal>;
}

function formatMoney(value: number) { return new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value); }

function normalizeName(value: string) {
  return value.trim().toLocaleLowerCase("hr").replace(/\s+/g, " ");
}

function dedupeExpenses(expenses: Expense[]) {
  const items = new Map<string, Expense>();
  expenses.forEach((item) => {
    const key = normalizeName(item.name);
    const existing = items.get(key);
    if (!existing) {
      items.set(key, item);
      return;
    }
    items.set(key, {
      ...existing,
      planned: Math.max(existing.planned, item.planned),
      paid: Math.max(existing.paid, item.paid),
      isGift: existing.isGift || item.isGift,
    });
  });
  return [...items.values()];
}
