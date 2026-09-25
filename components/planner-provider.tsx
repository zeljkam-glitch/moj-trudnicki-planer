"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { initialState } from "@/lib/seed";
import type { PlannerState } from "@/lib/types";

const STORAGE_KEY = "moj-trudnicki-planer:v2";
const LEGACY_STORAGE_KEY = "moj-trudnicki-planer:v1";

type PlannerContextValue = {
  state: PlannerState;
  hydrated: boolean;
  update: (updater: (current: PlannerState) => PlannerState) => void;
  replace: (next: Partial<PlannerState>) => void;
  reset: () => void;
};

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlannerState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
        if (saved) setState(mergeWithCurrentCatalog(JSON.parse(saved) as Partial<PlannerState>));
      } catch {
        // A corrupt or blocked local store should not prevent the planner from opening.
      } finally {
        setHydrated(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // The in-memory planner remains usable when storage is blocked or full.
    }
  }, [state, hydrated]);

  const update = useCallback((updater: (current: PlannerState) => PlannerState) => {
    setState((current) => updater(current));
  }, []);

  const replace = useCallback((next: Partial<PlannerState>) => {
    setState(mergeWithCurrentCatalog(next));
  }, []);

  const reset = useCallback(() => {
    setState({ ...initialState, settings: { ...initialState.settings, onboardingComplete: true } });
  }, []);

  const value = useMemo(() => ({ state, hydrated, update, replace, reset }), [state, hydrated, update, replace, reset]);
  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function mergeWithCurrentCatalog(saved: Partial<PlannerState>): PlannerState {
  const savedPreparations = saved.preparations ?? [];
  const preparations = initialState.preparations.map((catalogItem) => {
    const match = savedPreparations.find((item) => item.name.toLocaleLowerCase("hr") === catalogItem.name.toLocaleLowerCase("hr") && item.group === catalogItem.group);
    return match ? { ...catalogItem, status: match.status, plannedCost: match.plannedCost, paidCost: match.paidCost, store: match.store, plannedMonth: match.plannedMonth, note: match.note ?? catalogItem.note, owner: match.owner } : catalogItem;
  });
  const extraPreparations = savedPreparations.filter((item) => item.custom);

  const savedBagItems = saved.bagItems ?? [];
  const bagItems = initialState.bagItems.map((catalogItem) => {
    const match = savedBagItems.find((item) => item.name.toLocaleLowerCase("hr") === catalogItem.name.toLocaleLowerCase("hr") && item.bag === catalogItem.bag);
    return match ? { ...catalogItem, packed: match.packed } : catalogItem;
  });
  const extraBagItems = savedBagItems.filter((item) => item.custom);

  const savedReadingItems = saved.readingList ?? [];
  const readingList = initialState.readingList.map((catalogItem) => {
    const match = savedReadingItems.find((item) => item.id === catalogItem.id || item.title.toLocaleLowerCase("hr") === catalogItem.title.toLocaleLowerCase("hr"));
    return match ? { ...catalogItem, read: match.read } : catalogItem;
  });
  const extraReadingItems = savedReadingItems.filter((item) => item.custom);

  return {
    ...initialState,
    ...saved,
    settings: { ...initialState.settings, ...saved.settings },
    birthPlan: { ...initialState.birthPlan, ...saved.birthPlan },
    story: { ...initialState.story, ...saved.story },
    preparations: [...preparations, ...extraPreparations],
    bagItems: [...bagItems, ...extraBagItems],
    adminTasks: initialState.adminTasks.map((task) => saved.adminTasks?.find((candidate) => candidate.name === task.name) ?? task),
    readingList: [...readingList, ...extraReadingItems],
    courses: saved.courses ?? initialState.courses,
    notes: saved.notes ?? initialState.notes,
    appointments: saved.appointments ?? initialState.appointments,
    moodEntries: saved.moodEntries ?? initialState.moodEntries,
  };
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) throw new Error("usePlanner must be used inside PlannerProvider");
  return context;
}
