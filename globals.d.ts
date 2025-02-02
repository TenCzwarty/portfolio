declare global {
  type Children = Readonly<{ children: React.ReactNode }>;
  type FCWithChildren = React.FC<Children>;
}

export {};
