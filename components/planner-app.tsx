"use client";

import { useCallback, useState } from "react";
import type { AppSection } from "@/lib/types";
import { PlannerProvider, usePlanner } from "./planner-provider";
import { AppShell } from "./app-shell";
import { TodayView } from "./views/today-view";
import { PreparationsView } from "./views/preparations-view";
import { BagView } from "./views/bag-view";
import { ExpensesView } from "./views/expenses-view";
import { BirthPlanView } from "./views/birth-plan-view";
import { AfterBirthView } from "./views/after-birth-view";
import { Onboarding } from "./views/onboarding";
import { StoryView } from "./views/story-view";
import { EducationView } from "./views/education-view";
import { NotesView } from "./views/notes-view";
import { MoreView } from "./views/more-view";
import { AppointmentsView } from "./views/appointments-view";
import { HospitalModeView } from "./views/hospital-mode-view";

export function PlannerApp() {
  return <PlannerProvider><PlannerContent /></PlannerProvider>;
}

function PlannerContent() {
  const [section, setSection] = useState<AppSection>("today");
  const { state, hydrated, storageError, startPersonal } = usePlanner();
  const navigate = useCallback((nextSection: AppSection) => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setSection(nextSection);
  }, []);

  if (!hydrated) return <div className="loading-screen"><span className="brand-mark large"><span /></span><p>Otvaram tvoj planer…</p></div>;

  return <>
    {state.settings.demoMode && <div className="planner-notice demo-notice" role="status">Pregled primjera: promjene se ne spremaju. <button onClick={startPersonal}>Započni svoj planer</button></div>}
    {storageError && !state.settings.demoMode && <div className="planner-notice storage-notice" role="alert">Podaci se ne mogu spremiti u ovom pregledniku. Provjeri postavke pohrane i preuzmi sigurnosnu kopiju.</div>}
    <AppShell section={section} onNavigate={navigate}>
      {section === "today" && <TodayView onNavigate={navigate} />}
      {section === "appointments" && <AppointmentsView />}
      {section === "story" && <StoryView />}
      {section === "preparations" && <PreparationsView />}
      {section === "bag" && <BagView />}
      {section === "hospital" && <HospitalModeView onNavigate={navigate} />}
      {section === "expenses" && <ExpensesView onNavigate={navigate} />}
      {section === "birth-plan" && <BirthPlanView />}
      {section === "education" && <EducationView />}
      {section === "after-birth" && <AfterBirthView />}
      {section === "notes" && <NotesView />}
      {section === "more" && <MoreView onNavigate={navigate} />}
    </AppShell>
    {!state.settings.onboardingComplete && <Onboarding />}
  </>;
}
