import type { BoxArticleType } from "./types";

export const BoxArticle = ({ title, href, year, category }: BoxArticleType) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="flex flex-col rounded-xl border border-slate-300 p-4 hover:bg-slate-200"
    >
      <div className="flex justify-between gap-2">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <div>{category}</div>
        </div>
        <div>{year}</div>
      </div>
    </a>
  );
};

export const myWritingMapper = (props: BoxArticleType, index: number) => (
  <BoxArticle key={index} {...props} />
);
