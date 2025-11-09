import { DownloadIcon } from "lucide-react";
import Link from "next/link";

import { Pill } from "~/components/pill";
import { Section } from "~/components/section";

export default function UtilsPage() {
  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <div className="mt-16 mb-8 ml-4">
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

          <Link href="/utils/hanayama">
            <div className="mt-4 flex flex-col rounded-xl border border-neutral-200 p-4 hover:bg-neutral-200">
              <h3 className="text-lg font-semibold sm:text-xl">
                Hanayama Tracker
              </h3>
              <div className="text-sm">track your metal puzzles collection</div>
            </div>
          </Link>

          <div className="mt-4 flex flex-col rounded-xl border border-neutral-200 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold sm:text-xl">
                  Photo Slideshow
                </h3>
                <div className="text-sm">
                  local photo slider with simple transitions
                </div>
              </div>

              <div>
                <a
                  id="local-photo-slideshow"
                  href="/files/utils/local-photo-slideshow/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900 mx-auto sm:mx-0">
                    download <DownloadIcon size={16} className="inline" />
                  </Pill>
                </a>
              </div>
            </div>
          </div>

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

          <div className="relative h-[80px] bg-linear-to-b from-transparent to-neutral-100">
            <div className="absolute -z-10 h-[80px] w-[100%] rounded-xl border border-neutral-200 p-4"></div>
          </div>
        </div>
      </Section>
    </main>
  );
}
