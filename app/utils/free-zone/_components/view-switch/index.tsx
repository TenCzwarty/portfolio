import Link from "next/link";
import { usePathname } from "next/navigation";

const VIEWS = [
  { href: "/utils/free-zone", label: "calendar" },
  { href: "/utils/free-zone/board", label: "ideas" },
];

/** Calendar and board are one tool: same people, same secret link, one tap apart. */
export const ViewSwitch = () => {
  const pathname = usePathname();

  return (
    <nav className="mt-2 flex gap-2">
      {VIEWS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? "page" : undefined}
          className={`rounded-full px-3 py-1 text-sm sm:px-4 sm:text-base ${
            pathname === href
              ? "bg-accent-500 text-primary-900"
              : "bg-primary-900 hover:bg-accent-500 hover:text-primary-900 text-white"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};
