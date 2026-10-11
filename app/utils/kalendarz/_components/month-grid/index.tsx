import React from "react";

import type { TDay, TPerson, TPlan } from "../../_types";
import { fromDay, WEEKDAYS } from "../../_utils/dates";
import { layoutWeekPlans } from "../../_utils/layout-plans";

type TMonthGrid = {
  weeks: Array<Array<TDay>>;
  month: number;
  today: TDay;
  plans: Array<TPlan>;
  people: Array<TPerson>;
  freeByDay: Map<TDay, Array<TPerson>>;
  me: TPerson | null;
  range: { start: TDay; end: TDay } | null;
  selectedPlanId: string | null;
  /** while picking a range, bars must not swallow clicks meant for days */
  plansClickable: boolean;
  onDayClick: (day: TDay) => void;
  onDayHover: (day: TDay) => void;
  onPlanClick: (plan: TPlan) => void;
};

const LANE_HEIGHT = "1.625rem";

export const MonthGrid = ({
  weeks,
  month,
  today,
  plans,
  people,
  freeByDay,
  me,
  range,
  selectedPlanId,
  plansClickable,
  onDayClick,
  onDayHover,
  onPlanClick,
}: TMonthGrid) => {
  const creatorColor = (id: string) => people.find((p) => p.id === id)?.color;

  return (
    <div className="@container overflow-hidden rounded-xl border border-neutral-200">
      <div className="grid grid-cols-7 border-b border-neutral-200 text-center text-sm">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      {weeks.map((week) => {
        const segments = layoutWeekPlans(week, plans);
        const lanes = segments.reduce((max, s) => Math.max(max, s.lane + 1), 0);

        return (
          <div
            key={week[0]}
            className="grid grid-cols-7 border-b border-neutral-200 last:border-b-0"
            style={{
              // square days: row is at least one column wide, grows only when plans need room
              minHeight: "calc(100cqw / 7)",
              // repeat(0, …) is invalid CSS and would drop the whole template
              gridTemplateRows: `auto ${lanes ? `repeat(${lanes}, ${LANE_HEIGHT})` : ""} minmax(1.25rem, 1fr)`,
            }}
          >
            {week.map((day, col) => {
              const date = fromDay(day);
              const free = freeByDay.get(day) ?? [];
              const everyone = people.length > 1 && free.length === people.length;
              const mine = me ? free.some((p) => p.id === me.id) : false;
              const inRange = range && day >= range.start && day <= range.end;

              return (
                <React.Fragment key={day}>
                  <button
                    type="button"
                    onClick={() => onDayClick(day)}
                    onMouseEnter={() => onDayHover(day)}
                    aria-label={`${date.toLocaleDateString("pl-PL", { dateStyle: "full" })}${free.length ? `, wolni: ${free.map((p) => p.name).join(", ")}` : ""}`}
                    aria-pressed={mine}
                    className={`border-neutral-200 transition-colors hover:bg-neutral-200 ${col < 6 ? "border-r" : ""} ${inRange ? "!bg-accent-500/40" : ""} ${everyone ? "shadow-[inset_0_0_0_2px_var(--color-accent-900)]" : ""}`}
                    style={{ gridColumn: col + 1, gridRow: "1 / -1" }}
                  />
                  <div
                    className={`pointer-events-none p-1 text-sm sm:p-2 sm:text-base ${date.getMonth() !== month ? "opacity-30" : ""}`}
                    style={{ gridColumn: col + 1, gridRow: 1 }}
                  >
                    <span
                      className={`inline-flex size-6 items-center justify-center rounded-full sm:size-7 ${day === today ? "bg-primary-900 text-white" : ""}`}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                  <div
                    className="pointer-events-none flex flex-wrap content-end gap-1 p-1 sm:p-2"
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
                </React.Fragment>
              );
            })}

            {segments.map(({ plan, from, to, lane, continuesBefore, continuesAfter }) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => onPlanClick(plan)}
                title={plan.title}
                className={`bg-primary-800 z-10 mx-0.5 my-px flex items-center gap-1 truncate px-1.5 text-left text-xs leading-none text-white sm:mx-1 sm:px-2 sm:text-sm ${continuesBefore ? "rounded-l-none" : "rounded-l-md"} ${continuesAfter ? "rounded-r-none" : "rounded-r-md"} ${selectedPlanId === plan.id ? "ring-accent-900 ring-2" : ""} ${plansClickable ? "" : "pointer-events-none opacity-70"}`}
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
