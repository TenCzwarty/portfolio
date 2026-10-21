import { Logo } from "~/components/logo";

/** full screen by default; pass a height class to spin inside a smaller box */
export const Spinner = ({ className = "h-[100vh]" }: { className?: string }) => (
  <div className={`flex w-full items-center justify-center ${className}`}>
    <Logo className="spin-fast" />
  </div>
);
