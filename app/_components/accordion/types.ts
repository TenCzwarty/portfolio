export type TAccordionController = {
  children: (props: {
    isOpened: boolean;
    toggleIsOpened: () => void;
  }) => React.JSX.Element;
};

export type TAccordion = {
  isOpened: boolean;
} & TChildren;

export type TAccordionToggleExtraSettings = {
  isOpened: boolean;
  toggleIsOpened: () => void;
};

export type TAccordionToggleMoreInfo = {
  name?: string;
  isOpened: boolean;
  toggleIsOpened: () => void;
};
