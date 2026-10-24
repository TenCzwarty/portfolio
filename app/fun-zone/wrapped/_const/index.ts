import type { TWrappedVideo, TWrappedYear } from "./types";

export const WRAPPED_PATH = "/fun-zone/wrapped";

/** the old page fades out for this long before the next one fades in */
export const DURATION_PAGE_FADE = 500;

export const HOME_VIDEO: TWrappedVideo = { videoId: "LML6SoNE7xE" };

export const YEARS: TWrappedYear[] = [
  { year: "2021", videoId: "JxA0DmlfwCI" },
  { year: "2022", videoId: "Ug0KpL08OX0", start: 186, end: 359 },
  { year: "2023", videoId: "LaXazWRppwI" },
  { year: "2024", videoId: "fqJAwCabrfg" },
];

export const getYearPath = (year: string) => `${WRAPPED_PATH}/${year}`;
