import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type TParameters = {
  onPageOpened: (searchParams: string) => void;
  getSearchParamsOnValuesChange: () => string;
  values: Array<unknown>;
};

export const useQueryString = ({
  onPageOpened,
  getSearchParamsOnValuesChange,
  values,
}: TParameters) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    onPageOpened(searchParams.toString());
  }, []);

  React.useEffect(() => {
    router.replace(pathname + "?" + getSearchParamsOnValuesChange());
  }, values);
};
