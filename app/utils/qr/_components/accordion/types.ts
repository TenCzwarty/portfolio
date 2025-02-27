export type AccordionControllerProps = {
  children: (props: {
    isOpened: boolean;
    toggleIsOpened: () => void;
  }) => React.JSX.Element;
};

export type AccordionProps = {
  isOpened: boolean;
} & Children;

export type AccordionToggleExtraSettingsProps = {
  isOpened: boolean;
  toggleIsOpened: () => void;
};

export type AccordionToggleMoreInfoProps = {
  name: string;
  isOpened: boolean;
  toggleIsOpened: () => void;
};
