import React from "react";

import type { TDay, TPerson, TPlan } from "../../_types";
import { fromDay, WEEKDAYS } from "../../_utils/dates";
import { layoutWeekPlans } from "../../_utils/layout-plans";
import { StampLayer, type TStampItem } from "../stamp-layer";

type TMonthGrid = {
  weeks: Array<Array<TDay>>;
  month: number;
  today: TDay;
  plans: Array<TPlan>;
  people: Array<TPerson>;
  freeByDay: Map<TDay, Array<TPerson>>;
  stampsByDay: Map<TDay, Array<TStampItem>>;
  me: TPerson | null;
  /** plan being picked right now, drawn as a ghost bar */
  draft: { start: TDay; end: TDay; title: string } | null;
  selectedPlanId: string | null;
  /** while picking a range, bars must not swallow clicks meant for days */
  plansClickable: boolean;
  onDayClick: (day: TDay, event: React.MouseEvent) => void;
  onDayHover: (day: TDay) => void;
  onPlanClick: (plan: TPlan) => void;
};

const DRAFT_ID = "draft";

const NO_STAMPS: Array<TStampItem> = [];

const LANE_HEIGHT = "1.625rem";

export const MonthGrid = ({
  weeks,
  month,
  today,
  plans,
  people,
  freeByDay,
  stampsByDay,
  me,
  draft,
  selectedPlanId,
  plansClickable,
  onDayClick,
  onDayHover,
  onPlanClick,
}: TMonthGrid) => {
  const creatorColor = (id: string) => people.find((p) => p.id === id)?.color;

  return (
    <div className="@container overflow-hidden rounded-xl border border-neutral-200">
      <div className="grid grid-cols-7 border-b border-neutral-200 text-sm">
        {WEEKDAYS.map((d) => (
          <div key={d} className="px-1.5 py-2 sm:px-4">
            {d}
          </div>
        ))}
      </div>

      {weeks.map((week) => {
        const segments = layoutWeekPlans(
          week,
          draft ? [...plans, { id: DRAFT_ID, createdBy: "", ...draft }] : plans
        );
        const lanes = segments.reduce((max, s) => Math.max(max, s.lane + 1), 0);

        return (
          <div
            key={week[0]}
            className="grid grid-cols-7 border-b border-neutral-200 last:border-b-0"
            style={{
              // ~70% of a square, capped so the month fits on a laptop screen;
              // grows only when plans need room
              minHeight: "min(10cqw, 5.5rem)",
              // repeat(0, …) is invalid CSS and would drop the whole template
              gridTemplateRows: `auto ${lanes ? `repeat(${lanes}, ${LANE_HEIGHT})` : ""} minmax(1.25rem, 1fr)`,
            }}
          >
            {week.map((day, col) => {
              const date = fromDay(day);
              const free = freeByDay.get(day) ?? [];
              const stamps = stampsByDay.get(day) ?? NO_STAMPS;
              const mine = me ? free.some((p) => p.id === me.id) : false;

              return (
                <React.Fragment key={day}>
                  <button
                    type="button"
                    onClick={(e) => onDayClick(day, e)}
                    onMouseEnter={() => onDayHover(day)}
                    aria-label={`${date.toLocaleDateString("en-GB", { dateStyle: "full" })}${free.length ? `, free: ${free.map((p) => p.name).join(", ")}` : ""}${stamps.length ? `, ${stamps.map((s) => `${s.person.name}: ${s.stamp.label}`).join(", ")}` : ""}`}
                    aria-pressed={mine}
                    className={`border-neutral-200 transition-colors hover:bg-neutral-200 ${col < 6 ? "border-r" : ""}`}
                    style={{ gridColumn: col + 1, gridRow: "1 / -1" }}
                  />
                  <div
                    className={`pointer-events-none px-1.5 py-1 text-sm sm:px-4 sm:py-2 sm:text-base ${date.getMonth() !== month ? "opacity-30" : ""}`}
                    style={{ gridColumn: col + 1, gridRow: 1 }}
                  >
                    <span
                      className={`-ml-1.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 sm:h-7 sm:min-w-7 ${day === today ? "bg-primary-900 text-white" : ""}`}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                  <div
                    className="pointer-events-none flex flex-wrap content-end gap-1 px-1.5 py-1 sm:px-4 sm:py-2"
                    style={{ gridColumn: col + 1, gridRow: lanes + 2 }}
                  >
                    {free.map((p) => (
                      <span
                        key={p.id}
                        title={p.name}
                        className="size-2 rounded-full sm:size-3"
                        style={{ background: p.color }}
                      />
                    ))}
                  </div>
                  <StampLayer items={stamps} style={{ gridColumn: col + 1, gridRow: "1 / -1" }} />
                </React.Fragment>
              );
            })}

            {segments.map(({ plan, from, to, lane, continuesBefore, continuesAfter }) => (
              <button
                key={plan.id}
                tabIndex={plan.id === DRAFT_ID ? -1 : undefined}
                type="button"
                onClick={() => onPlanClick(plan)}
                title={plan.title}
                className={`bg-primary-800 z-10 mx-0.5 my-px flex items-center gap-1 truncate px-1.5 text-left text-xs leading-none text-white sm:mx-1 sm:px-2 sm:text-sm ${continuesBefore ? "rounded-l-none" : "rounded-l-md"} ${continuesAfter ? "rounded-r-none" : "rounded-r-md"} ${selectedPlanId === plan.id ? "ring-accent-900 ring-2" : ""} ${plan.id === DRAFT_ID ? "pointer-events-none border-2 border-dashed border-white/80 opacity-80" : plansClickable ? "" : "pointer-events-none opacity-70"}`}
                style={{ gridColumn: `${from + 1} / ${to + 2}`, gridRow: lane + 2 }}
              >
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ background: creatorColor(plan.createdBy) ?? "transparent" }}
                />
                <span className="truncate">{plan.title}</span>
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
};
