import SONGS_JSON from "./songs.json";
import type { TSong, TSongsJson } from "./types";

export const getAllSongs = () => SONGS_JSON as TSongsJson;

const SONGS = getAllSongs();

export const getSongsForCategory = (categoryTitle: string) =>
  SONGS.find((s) => s.title === categoryTitle)?.songs ?? [];

export const getFirstCategoryTitle = () => SONGS[0].title;

export const getFirstSongForCategory = (categoryTitle: string) =>
  getSongsForCategory(categoryTitle)[0];

export const findSongBySrc = (categoryTitle: string, src: string) =>
  getSongsForCategory(categoryTitle).find((s) => s.src === src);

export const getRandomSong = (songs: Array<TSong>, excludeSrc?: string) => {
  const availableSongs = excludeSrc
    ? songs.filter((s) => s.src !== excludeSrc)
    : songs;

  if (availableSongs.length === 0) {
    return;
  }

  return availableSongs[Math.floor(Math.random() * availableSongs.length)];
};
