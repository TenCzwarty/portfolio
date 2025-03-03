import Link from "next/link";

import { Section } from "~/components/layout/components/section";

export default function Utils() {
  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <div className="mb-8 ml-4 mt-16">
          <h1 className="text-xl font-semibold sm:text-3xl">Utils</h1>
          <p>
            place for apps / scripts I need that do not deserve their own
            website
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/utils/qr">
            <div className="flex flex-col rounded-xl border border-neutral-200 p-4 hover:bg-neutral-200">
              <h3 className="text-lg font-semibold sm:text-xl">
                QR Code Generator
              </h3>
              <div className="text-sm">quickly create qr codes, no bs</div>
            </div>
          </Link>

          <div className="flex cursor-not-allowed flex-col rounded-xl border border-neutral-200 p-4">
            <h3 className="text-lg font-semibold sm:text-xl">
              Month Time Block
            </h3>
            <div className="text-sm">in progress...</div>
          </div>

          <div className="flex cursor-not-allowed flex-col rounded-xl border border-neutral-200 p-4">
            <h3 className="text-lg font-semibold sm:text-xl">
              Secret Santa Generator
            </h3>
            <div className="text-sm">in progress...</div>
          </div>

          <div className="flex flex-col rounded-xl border border-neutral-200 p-4">
            <h3 className="text-lg font-semibold sm:text-xl">?</h3>
            <div className="text-sm">in progress...</div>
          </div>

          <div className="relative h-[80px] bg-gradient-to-b from-transparent to-neutral-100">
            <div className="absolute -z-10 h-[80px] w-[100%] rounded-xl border border-neutral-200 p-4"></div>
          </div>
        </div>
      </Section>
    </main>
  );
}
