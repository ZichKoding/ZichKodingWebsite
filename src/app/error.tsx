'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-gray-100">
      <h1 className="mb-2 text-6xl font-bold text-red-400">500</h1>
      <h2 className="mb-4 text-2xl font-semibold">Something went wrong</h2>
      <p className="mb-8 text-gray-400">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
