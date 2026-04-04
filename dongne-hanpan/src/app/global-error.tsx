"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-4 text-white px-4">
        <p className="text-4xl">💥</p>
        <h2 className="text-lg font-bold">치명적인 오류</h2>
        <p className="text-white/40 text-sm text-center">{error.message}</p>
        <button
          onClick={reset}
          className="mt-2 px-6 py-2 bg-red-600 rounded-full text-sm font-bold"
        >
          다시 시도
        </button>
      </body>
    </html>
  );
}
