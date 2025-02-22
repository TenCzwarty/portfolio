"use client";

import React from "react";

import { Input } from "../input";
import type { QrWebsiteProps } from "./types";

export const QrWebsite = ({ setValue }: QrWebsiteProps) => {
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    setValue(url);
  }, [url]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUrl(e.target.value);

  return (
    <Input type="text" value={url} onChange={onChange} placeholder="url" />
  );
};
