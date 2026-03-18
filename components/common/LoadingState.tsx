export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-3.5 w-14 rounded-full animate-shimmer" />
          <div className="h-4 w-3/4 rounded-lg animate-shimmer" />
        </div>
        <div className="h-8 w-8 rounded-xl animate-shimmer" />
      </div>
      <div className="h-3 w-full rounded-lg animate-shimmer" />
      <div className="h-3 w-2/3 rounded-lg animate-shimmer" />
      <div className="flex gap-3 pt-1">
        <div className="h-3 w-16 rounded-lg animate-shimmer" />
        <div className="h-3 w-12 rounded-lg animate-shimmer" />
      </div>
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}
