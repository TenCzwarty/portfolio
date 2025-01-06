export type ModalType = {
  title: string;
  linkWebsite?: string;
  linkMore?: string;
  linkCaseStudy?: string;

  year: string;
  short: string;
  long: string;

  brief: string[];
  myPart: string;
  techStack: string;
  results?: string;

  closeModal: () => void;
};
