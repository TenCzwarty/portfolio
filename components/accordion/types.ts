export type TAccordionController = {
  children: (props: {
    isOpened: boolean;
    toggleIsOpened: () => void;
  }) => React.JSX.Element;
  initialIsOpened?: boolean;
};

export type TAccordion = {
  isOpened: boolean;
} & TChildren;

export type TAccordionToggleExtraSettings = {
  isOpened: boolean;
  toggleIsOpened: () => void;
};

export type TAccordionToggleMoreInfo = {
  name?: React.ReactNode;
  isOpened: boolean;
  toggleIsOpened: () => void;
};
