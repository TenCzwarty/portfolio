export type TAmasiaCalendarConverterContext = {
  day: number;
  setDay: React.Dispatch<React.SetStateAction<number>>;
  onChangeDay: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
