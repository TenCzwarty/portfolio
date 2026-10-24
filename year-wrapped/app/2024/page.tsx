"use client";

import React from 'react';
import Link from 'next/link';

import { useBackgroundVideo } from '@/src/components/background-video/use-background-video';
import { usePageTransitionExpandingCircle } from '@/src/components/page-transition-expanding-circle/use-page-transition-expanding-circle';
  
export default function Wrapped() {
  const ref = usePageTransitionExpandingCircle();

  useBackgroundVideo('https://www.youtube.com/watch?v=fqJAwCabrfg');

  return (
      <div ref={ref} className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] transition-circle">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold text-center mb-8">2024</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/wrapped/previous"
              className="rounded-full bg-blue-500 text-white p-3 text-lg font-semibold hover:bg-blue-600 transition-colors"
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <Link
              href="/"
              className="rounded-full bg-blue-500 text-white p-3 text-lg font-semibold hover:bg-blue-600 transition-colors"
              aria-label="Back to Home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <Link
              href="/wrapped/next"
              className="rounded-full bg-blue-500 text-white p-3 text-lg font-semibold hover:bg-blue-600 transition-colors"
              aria-label="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
  );
}