type TLayoutFooterLinks = {
  left: Array<TLayoutLink>;
  right: Array<TLayoutLink>;
};

export type TFooterLinks = Record<TPathname, TLayoutFooterLinks>;

export type TReturnFooterLinks = TLayoutFooterLinks | null;
