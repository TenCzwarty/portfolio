import PUZZLES_JSON from "~hanayama/_const/puzzles.json";

type TParameters = {
  collectedPuzzles: Array<string>;
  completedPuzzles: Array<string>;
};

export const encode = ({ collectedPuzzles, completedPuzzles }: TParameters) => {
  const l: Array<string> = [];
  const m: Array<string> = [];
  const b: Array<string> = [];

  for (const { code: level, puzzles } of PUZZLES_JSON) {
    const levelCollected: Array<string> = [];
    const levelCompleted: Array<string> = [];
    const levelBoth: Array<string> = [];

    for (const { id, code } of puzzles) {
      const isCollected = collectedPuzzles.includes(id);
      const isCompleted = completedPuzzles.includes(id);

      if (isCollected && isCompleted) levelBoth.push(code);
      else if (isCollected) levelCollected.push(code);
      else if (isCompleted) levelCompleted.push(code);
    }

    if (levelCollected.length) l.push("." + level, ...levelCollected);
    if (levelCompleted.length) m.push("." + level, ...levelCompleted);
    if (levelBoth.length) b.push("." + level, ...levelBoth);
  }

  return { l, m, b };
};
