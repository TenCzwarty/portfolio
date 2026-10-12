"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  Accordion,
  AccordionController,
  AccordionExtraSettingsToggle,
} from "~/components/accordion";
import { Pill } from "~/components/pill";
import { Section } from "~/components/section";
import { Tooltip } from "~/components/tooltip";

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

const MODES: Array<{ value: TMode; label: string; hint: string }> = [
  {
    value: "availability",
    label: "I'm free",
    hint: "click a day to mark that you're free (click again to undo)",
  },
  { value: "plan", label: "new plan", hint: "click the first day of the plan, then the last one" },
];

export default function UtilsCalendarPage() {
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
    () => [...data.people].sort((a, b) => a.name.localeCompare(b.name)),
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
        <AccordionController>
          {(accordionProps) => (
            <div className="mt-16 mb-8 ml-4">
              <h1 className="text-xl font-semibold sm:text-3xl">Calendar</h1>
              <div className="flex gap-2">
                <p>shared plans and who&apos;s free when</p>
                {canEdit && <AccordionExtraSettingsToggle {...accordionProps} />}
              </div>

              <Accordion {...accordionProps}>
                <div className="mt-4 -ml-4 flex flex-col items-start gap-2 rounded-xl border border-neutral-200 p-4 text-sm">
                  {me && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMe(true);
                        accordionProps.toggleIsOpened();
                      }}
                      className="underline hover:no-underline"
                    >
                      change name or color
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={forgetSecret}
                    className="underline hover:no-underline"
                  >
                    forget the secret link on this device
                  </button>
                </div>
              </Accordion>
            </div>
          )}
        </AccordionController>

        <div className="space-y-4">
          {errorMessage && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
              {errorMessage}
              <button type="button" onClick={clearError} aria-label="close" className="px-2">
                ×
              </button>
            </div>
          )}

          {hydrated && status === "ready" && !canEdit && (
            <div className="rounded-xl border border-neutral-200 p-4 text-sm">
              view only — open the secret link to make changes
            </div>
          )}

          {showIdentityForm && (
            <IdentityForm
              key={me?.id ?? "new"}
              me={me}
              people={people}
              onSave={(person) => {
                setMe(person);
                setEditingMe(false);
              }}
              onCancel={me ? () => setEditingMe(false) : undefined}
            />
          )}

          <div className="ml-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold sm:text-xl">
              {hydrated ? formatMonth(cursor.year, cursor.month) : "\u00a0"}
            </h2>

            <div className="flex flex-wrap items-center gap-4">
              {canEdit &&
                me &&
                MODES.map(({ value, label, hint }) => (
                  <React.Fragment key={value}>
                    <Tooltip id={`calendar-mode-${value}`}>{hint}</Tooltip>
                    <button
                      type="button"
                      aria-pressed={mode === value}
                      data-tooltip-id={`calendar-mode-${value}`}
                      onClick={() => {
                        setMode(value);
                        resetPlanSelection();
                      }}
                    >
                      <Pill
                        classes={
                          mode === value
                            ? "bg-accent-500 text-primary-900"
                            : "bg-primary-900 hover:bg-accent-500 hover:text-primary-900"
                        }
                      >
                        {label}
                      </Pill>
                    </button>
                  </React.Fragment>
                ))}

              <div className="-mr-1 ml-auto flex items-center">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  aria-label="previous month"
                  className="rounded-full p-1 hover:bg-neutral-200"
                >
                  <ChevronLeftIcon size={20} />
                </button>
                <button
                  type="button"
                  onClick={goToday}
                  className="rounded-full px-3 py-1 text-sm hover:bg-neutral-200"
                >
                  today
                </button>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  aria-label="next month"
                  className="rounded-full p-1 hover:bg-neutral-200"
                >
                  <ChevronRightIcon size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* the page is prerendered at build time: anything date-based must wait for the browser,
              otherwise "today" and the month would be frozen at the build date until hydration */}
          <div className={status === "loading" ? "animate-pulse opacity-60" : ""}>
            {!hydrated ? (
              <div className="aspect-[7/5] rounded-xl border border-neutral-200" />
            ) : (
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
            )}
          </div>

          <div className="ml-4">
            <Legend
              people={people}
              availability={data.availability}
              monthDays={monthDays}
              me={me}
            />
          </div>

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
        </div>
      </Section>
    </main>
  );
}
