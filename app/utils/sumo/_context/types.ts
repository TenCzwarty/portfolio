export type TSumoContext = {
  /** zoomed card offers every finish as a preview, not only the printed ones */
  isShowingFinishPreviews: boolean;
  toggleIsShowingFinishPreviews: () => void;
};
