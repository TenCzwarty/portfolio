import React from "react";

import type { TDay, TPerson, TPlan } from "../../_types";
import { textColorOn } from "../../_utils/colors";
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
  draft: { start: TDay; end: TDay; title: string; createdBy: string } | null;
  selectedPlanId: string | null;
  /** days marked by hand in view mode (local only) */
  preselected: Set<TDay>;
  /** while picking a range, bars must not swallow clicks meant for days */
  plansClickable: boolean;
  onDayClick: (day: TDay, event: React.MouseEvent) => void;
  onDayHover: (day: TDay) => void;
  onPlanClick: (plan: TPlan) => void;
};

const DRAFT_ID = "draft";

const NO_STAMPS: Array<TStampItem> = [];

// thin bands along the bottom of the cells - a plan marks the days without covering them
const LANE_HEIGHT = "1rem";
const FALLBACK_COLOR = "#57534e";

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
  preselected,
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
          draft ? [...plans, { id: DRAFT_ID, ...draft }] : plans
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
              gridTemplateRows: `auto minmax(1.25rem, 1fr) ${lanes ? `repeat(${lanes}, ${LANE_HEIGHT})` : ""}`,
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
                    aria-current={preselected.has(day) ? "true" : undefined}
                    className={`border-neutral-200 transition-colors ${preselected.has(day) ? "bg-accent-500/60 hover:bg-accent-500/80" : "hover:bg-neutral-200"} ${col < 6 ? "border-r" : ""}`}
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
                    style={{ gridColumn: col + 1, gridRow: 2 }}
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
                  <StampLayer
                    items={stamps}
                    // above the plan bands: stamps let clicks through, so plans stay clickable
                    style={{ gridColumn: col + 1, gridRow: "1 / -1", zIndex: 20 }}
                  />
                </React.Fragment>
              );
            })}

            {segments.map(({ plan, from, to, lane, continuesBefore, continuesAfter }) => {
              const color = creatorColor(plan.createdBy) ?? FALLBACK_COLOR;
              const isDraft = plan.id === DRAFT_ID;

              return (
                <button
                  key={plan.id}
                  tabIndex={isDraft ? -1 : undefined}
                  type="button"
                  onClick={() => onPlanClick(plan)}
                  title={plan.title}
                  className={`z-10 mb-0.5 flex items-center truncate px-1.5 text-left text-[0.6rem] leading-none font-semibold sm:px-2 sm:text-[0.7rem] ${continuesBefore ? "" : "ml-0.5 rounded-l-sm sm:ml-1"} ${continuesAfter ? "" : "mr-0.5 rounded-r-sm sm:mr-1"} ${selectedPlanId === plan.id ? "ring-primary-900 ring-2" : ""} ${isDraft ? "pointer-events-none border border-dashed" : plansClickable ? "hover:brightness-110" : "pointer-events-none opacity-60"}`}
                  style={{
                    gridColumn: `${from + 1} / ${to + 2}`,
                    gridRow: lane + 3,
                    ...(isDraft
                      ? { background: `${color}40`, borderColor: color, color: "inherit" }
                      : { background: color, color: textColorOn(color) }),
                  }}
                >
                  <span className="truncate">{plan.title}</span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
