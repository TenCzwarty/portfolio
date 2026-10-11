"use client";

import React from "react";
import { CalendarRangeIcon, ChevronLeftIcon, ChevronRightIcon, HandIcon } from "lucide-react";

import { Section } from "~/components/section";

import { IdentityForm } from "./_components/identity-form";
import { Legend } from "./_components/legend";
import { MonthGrid } from "./_components/month-grid";
import { PlanDetails } from "./_components/plan-details";
import { PlanForm } from "./_components/plan-form";
import { formatMonth, fromDay, getMonthWeeks, toDay } from "./_utils/dates";
import { newId } from "./_utils/identity";
import { useCalendar } from "./_utils/use-calendar";
import type { TDay, TPerson, TPlan } from "./_types";

type TMode = "availability" | "plan";

export default function UtilsKalendarzPage() {
  const {
    data,
    canEdit,
    status,
    errorMessage,
    clearError,
    me,
    setMe,
    hydrated,
    send,
    forgetSecret,
  } = useCalendar();

  const today = toDay(new Date());
  const [cursor, setCursor] = React.useState(() => ({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  }));
  const [mode, setMode] = React.useState<TMode>("availability");
  const [editingMe, setEditingMe] = React.useState(false);
  const [rangeStart, setRangeStart] = React.useState<TDay | null>(null);
  const [rangeHover, setRangeHover] = React.useState<TDay | null>(null);
  const [newPlanRange, setNewPlanRange] = React.useState<{ start: TDay; end: TDay } | null>(null);
  const [selectedPlanId, setSelectedPlanId] = React.useState<string | null>(null);

  const weeks = React.useMemo(() => getMonthWeeks(cursor.year, cursor.month), [cursor]);
  const monthDays = React.useMemo(
    () => weeks.flat().filter((d) => fromDay(d).getMonth() === cursor.month),
    [weeks, cursor.month]
  );

  const people = React.useMemo(
    () => [...data.people].sort((a, b) => a.name.localeCompare(b.name, "pl")),
    [data.people]
  );

  const freeByDay = React.useMemo(() => {
    const map = new Map<TDay, Array<TPerson>>();
    for (const person of people) {
      for (const day of data.availability[person.id] ?? []) {
        map.set(day, [...(map.get(day) ?? []), person]);
      }
    }
    return map;
  }, [people, data.availability]);

  const selectedPlan = data.plans.find((p) => p.id === selectedPlanId) ?? null;

  const resetPlanSelection = () => {
    setRangeStart(null);
    setRangeHover(null);
    setNewPlanRange(null);
  };

  const shiftMonth = (delta: number) =>
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const goToday = () => setCursor({ year: new Date().getFullYear(), month: new Date().getMonth() });

  const onDayClick = (day: TDay) => {
    setSelectedPlanId(null);
    if (!canEdit) return;
    if (!me) {
      setEditingMe(true);
      return;
    }

    if (mode === "availability") {
      const available = !(data.availability[me.id] ?? []).includes(day);
      send({ type: "availability", personId: me.id, day, available });
      return;
    }

    if (!rangeStart || newPlanRange) {
      setNewPlanRange(null);
      setRangeStart(day);
      setRangeHover(day);
      return;
    }

    const [start, end] = [rangeStart, day].sort();
    setNewPlanRange({ start, end });
  };

  const onAddPlan = (title: string) => {
    if (!newPlanRange || !me) return;
    const plan: TPlan = { id: newId(), title, ...newPlanRange, createdBy: me.id };
    send({ type: "plan-add", plan });
    resetPlanSelection();
  };

  const previewRange =
    newPlanRange ??
    (rangeStart && rangeHover
      ? { start: [rangeStart, rangeHover].sort()[0], end: [rangeStart, rangeHover].sort()[1] }
      : null);

  const showIdentityForm = hydrated && canEdit && (editingMe || !me);

  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <div className="mt-16 mb-8 ml-4">
          <h1 className="text-xl font-semibold sm:text-3xl">Kalendarz</h1>
          <p>wspólne plany i kto kiedy ma czas</p>
        </div>

        <div className="space-y-4">
          {errorMessage && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
              {errorMessage}
              <button type="button" onClick={clearError} aria-label="zamknij" className="px-2">
                ×
              </button>
            </div>
          )}

          {hydrated && status === "ready" && !canEdit && (
            <div className="rounded-xl border border-neutral-200 p-3 text-sm">
              tylko podgląd — żeby coś zapisać, otwórz sekretny link
            </div>
          )}

          {showIdentityForm && (
            <IdentityForm
              key={me?.id ?? "new"}
              me={me}
              takenColors={people.filter((p) => p.id !== me?.id).map((p) => p.color)}
              onSave={(person) => {
                setMe(person);
                setEditingMe(false);
              }}
              onCancel={me ? () => setEditingMe(false) : undefined}
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="poprzedni miesiąc"
                className="rounded-full p-1 hover:bg-neutral-200"
              >
                <ChevronLeftIcon size={20} />
              </button>
              <h2 className="min-w-[10ch] text-center text-lg font-semibold first-letter:uppercase">
                {formatMonth(cursor.year, cursor.month)}
              </h2>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="następny miesiąc"
                className="rounded-full p-1 hover:bg-neutral-200"
              >
                <ChevronRightIcon size={20} />
              </button>
              <button
                type="button"
                onClick={goToday}
                className="ml-1 rounded-full px-3 py-1 text-sm hover:bg-neutral-200"
              >
                dziś
              </button>
            </div>

            {canEdit && me && (
              <div className="flex items-center gap-2">
                <div
                  role="radiogroup"
                  aria-label="tryb"
                  className="flex rounded-full border border-neutral-200 p-0.5 text-sm"
                >
                  {(
                    [
                      ["availability", "mam czas", <HandIcon key="i" size={14} />],
                      ["plan", "nowy plan", <CalendarRangeIcon key="i" size={14} />],
                    ] as const
                  ).map(([value, label, icon]) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={mode === value}
                      onClick={() => {
                        setMode(value);
                        resetPlanSelection();
                      }}
                      className={`flex items-center gap-1 rounded-full px-3 py-1 ${mode === value ? "bg-primary-900 text-white" : "hover:bg-neutral-200"}`}
                    >
                      {icon}
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setEditingMe(true)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 text-sm hover:bg-neutral-200"
                  title="zmień imię lub kolor"
                >
                  <span className="size-3 rounded-full" style={{ background: me.color }} />
                  {me.name}
                </button>
              </div>
            )}
          </div>

          {canEdit && me && (
            <p className="text-xs opacity-70">
              {mode === "availability"
                ? "kliknij dzień, żeby oznaczyć, że masz czas (drugi klik cofa)"
                : rangeStart && !newPlanRange
                  ? "teraz kliknij ostatni dzień planu"
                  : "kliknij pierwszy dzień planu"}
            </p>
          )}

          <div className={status === "loading" ? "animate-pulse opacity-60" : ""}>
            <MonthGrid
              weeks={weeks}
              month={cursor.month}
              today={today}
              plans={data.plans}
              people={people}
              freeByDay={freeByDay}
              me={me}
              range={mode === "plan" ? previewRange : null}
              selectedPlanId={selectedPlanId}
              plansClickable={mode !== "plan" || !canEdit}
              onDayClick={onDayClick}
              onDayHover={(day) => rangeStart && !newPlanRange && setRangeHover(day)}
              onPlanClick={(plan) => {
                resetPlanSelection();
                setSelectedPlanId(plan.id === selectedPlanId ? null : plan.id);
              }}
            />
          </div>

          <Legend people={people} availability={data.availability} monthDays={monthDays} me={me} />
          {people.length > 1 && (
            <p className="text-xs opacity-70">obramowany dzień = wszyscy mają czas</p>
          )}

          {newPlanRange && (
            <PlanForm
              start={newPlanRange.start}
              end={newPlanRange.end}
              onSave={onAddPlan}
              onCancel={resetPlanSelection}
            />
          )}

          {selectedPlan && (
            <PlanDetails
              plan={selectedPlan}
              people={people}
              availability={data.availability}
              canEdit={canEdit}
              onDelete={() => {
                send({ type: "plan-delete", id: selectedPlan.id });
                setSelectedPlanId(null);
              }}
              onClose={() => setSelectedPlanId(null)}
            />
          )}

          {canEdit && (
            <button
              type="button"
              onClick={forgetSecret}
              className="text-xs underline opacity-60 hover:opacity-100"
            >
              zapomnij sekretny link na tym urządzeniu
            </button>
          )}
        </div>
      </Section>
    </main>
  );
}
