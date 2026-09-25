import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./icons";

export function Button({ children, variant = "primary", icon, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; icon?: IconName }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{icon && <Icon name={icon} size={18} />}{children}</button>;
}

export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <label className="search-input"><Icon name="search" size={18} /><input {...props} /></label>;
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <header className="page-header"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{action}</header>;
}

export function EmptyState({ icon = "sparkle", title, text }: { icon?: IconName; title: string; text: string }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name={icon} /></span><h3>{title}</h3><p>{text}</p></div>;
}

export function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Zatvori"><Icon name="close" /></button></div>{children}</section></div>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}
