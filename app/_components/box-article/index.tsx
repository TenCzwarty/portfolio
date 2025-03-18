import type { TBoxArticle } from "./types";

const BoxArticle = ({ title, href, year, category }: TBoxArticle) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer noopener"
    className="box border-neutral-200 hover:bg-neutral-200"
  >
    <div className="flex justify-between gap-2">
      <div>
        <h3 className="text-lg font-semibold sm:text-xl">{title}</h3>
        <div className="text-sm">{category}</div>
      </div>
      <div className="hidden sm:block">{year}</div>
    </div>
  </a>
);

export const myWritingMapper = (props: TBoxArticle, index: number) => (
  <BoxArticle key={index} {...props} />
);
