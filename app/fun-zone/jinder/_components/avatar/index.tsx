import React from "react";
import { UserIcon } from "lucide-react";

import type { TUser } from "../../_types";

type TAvatar = {
  user: TUser | null;
  loadImage: (url: string) => Promise<string | null>;
  /** tailwind size class */
  size?: string;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

/** Jira avatar through the proxy, initials until it arrives or when it cannot be loaded */
export const Avatar = ({ user, loadImage, size = "size-5" }: TAvatar) => {
  const [src, setSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSrc(null);
    if (!user?.avatarUrl) return;
    let stale = false;
    loadImage(user.avatarUrl).then((blobUrl) => !stale && setSrc(blobUrl));
    return () => {
      stale = true;
    };
  }, [user?.avatarUrl, loadImage]);

  if (!user) {
    return (
      <span
        className={`${size} flex shrink-0 items-center justify-center rounded-full bg-neutral-200`}
      >
        <UserIcon className="size-3/5" />
      </span>
    );
  }

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- blob: URL, nothing to optimize
    return <img src={src} alt="" className={`${size} shrink-0 rounded-full object-cover`} />;
  }

  return (
    <span
      className={`${size} bg-primary-900 flex shrink-0 items-center justify-center rounded-full text-[10px] text-white`}
    >
      {initials(user.displayName)}
    </span>
  );
};
