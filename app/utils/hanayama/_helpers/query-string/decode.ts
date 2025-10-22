import PUZZLES_JSON from "~hanayama/_const/puzzles.json";

export const decode = ({ l = "", m = "", b = "" }) => {
  const parsedL = parseLevelSegment(l);
  const parsedM = parseLevelSegment(m);
  const parsedB = parseLevelSegment(b);

  const collectedCodes: Record<string, { codes: Array<string> }> = {};
  const completedCodes: Record<string, { codes: Array<string> }> = {};

  mergeLevelCodes(collectedCodes, parsedL);
  mergeLevelCodes(completedCodes, parsedM);
  mergeLevelCodes(collectedCodes, parsedB);
  mergeLevelCodes(completedCodes, parsedB);

  const codeToIdMap = buildPuzzleCodeToIdMap();

  const collectedIds: Array<string> = [];
  const completedIds: Array<string> = [];

  Object.keys(collectedCodes).forEach((levelCode) => {
    collectedIds.push(
      ...(collectedCodes[levelCode].codes || []).map(
        (code) => codeToIdMap[levelCode][code],
      ),
    );
  });

  Object.keys(completedCodes).forEach((levelCode) => {
    completedIds.push(
      ...(completedCodes[levelCode].codes || []).map(
        (code) => codeToIdMap[levelCode][code],
      ),
    );
  });

  return { collectedIds, completedIds, codeToIdMap };
};

// .1234567 => {level: 1, codes: [23, 45, 67]}
const parseLevelSegment = (segment = "") =>
  segment
    .split(".")
    .filter((s) => s !== "")
    .map((entry) => ({
      level: entry[0],
      codes: entry.substring(1).match(/.{2}/g),
    }));

// {level1, codesA}, [{level1, codesB}, {level2, codesC}] => [{level1, codesA+codesB}, {level2, codesC}]
const mergeLevelCodes = (
  target: Record<string, { codes: Array<string> | null }>,
  levelEntries: Array<{ level: string; codes: Array<string> | null }>,
) => {
  levelEntries.forEach((lev) => {
    const current = target[lev.level] || { codes: [] };

    target[lev.level] = {
      ...current,
      codes: [...(current.codes || []), ...(lev.codes || [])],
    };
  });
};

// PUZZLES_JSON => {levelCode: {puzzle1Code: puzzle1Id, puzzle2Code: puzzle2Id, ...}, ...}
const buildPuzzleCodeToIdMap = () => {
  const map: Record<string, Record<string, string>> = {};

  PUZZLES_JSON.forEach(({ code, puzzles }) => {
    map[code] = {};

    puzzles.forEach((puzzle) => {
      map[code][puzzle.code] = puzzle.id;
    });
  });

  return map;
};
