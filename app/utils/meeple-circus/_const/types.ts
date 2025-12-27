export type TSong = {
  title: string;
  src: string;
  highlightTimestamps?: Array<number>;
};

export type TSongsCategory = {
  title: string;
  songs: Array<TSong>;
};

export type TSongsJson = Array<TSongsCategory>;
