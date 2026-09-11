/* Elegant skeleton states — cards, rows, whole-page fallback. */

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton ${className}`} />;
}

export function CarCardSkeleton() {
  return (
    <div className="border border-line bg-[#0c0c0c]">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function CarGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-px sm:grid-cols-2"
      role="status"
      aria-label="Loading vehicles"
    >
      {Array.from({ length: count }, (_, i) => (
        <CarCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-250 items-center justify-center container-px">
      <div className="flex items-center gap-4">
        <span
          className="inline-block size-3.5 rounded-full border border-crimson border-t-transparent"
          style={{ animation: "spin 0.9s linear infinite" }}
        />
        <span className="label-mono">Loading AUREV…</span>
      </div>
    </div>
  );
}
