import type { TDay, TPlan } from "../_types";

export type TPlanSegment = {
  plan: TPlan;
  /** 0-based column where the bar starts / ends (inclusive) in this week */
  from: number;
  to: number;
  lane: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
};

/** Cut plans into per-week segments and stack overlapping ones into lanes */
export const layoutWeekPlans = (week: Array<TDay>, plans: Array<TPlan>): Array<TPlanSegment> => {
  const weekStart = week[0];
  const weekEnd = week[6];

  const visible = plans
    .filter((p) => p.start <= weekEnd && p.end >= weekStart)
    .sort((a, b) => a.start.localeCompare(b.start) || b.end.localeCompare(a.end));

  const laneEnds: Array<number> = [];

  return visible.map((plan) => {
    const from = plan.start < weekStart ? 0 : week.indexOf(plan.start);
    const to = plan.end > weekEnd ? 6 : week.indexOf(plan.end);

    let lane = laneEnds.findIndex((end) => end < from);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = to;

    return {
      plan,
      from,
      to,
      lane,
      continuesBefore: plan.start < weekStart,
      continuesAfter: plan.end > weekEnd,
    };
  });
};
