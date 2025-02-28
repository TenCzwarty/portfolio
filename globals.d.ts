declare global {
  type TChildren = Readonly<{ children: React.ReactNode }>;
  type TFCWithChildren = React.FC<TChildren>;
}

export {};
