export default function ServicesLoading() {
  return (
    <div>
      {/* PageHeader skeleton */}
      <div className="bg-navy-dark px-4 sm:px-6 lg:px-8 py-10 text-center">
        <div className="h-7 w-52 bg-white/10 rounded mx-auto mb-2" />
        <div className="h-4 w-64 bg-white/10 rounded mx-auto" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search bar skeleton */}
        <div className="h-11 w-full bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 animate-pulse" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/[0.07] p-5 animate-pulse"
            >
              <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-700 rounded mb-3" />
              <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-700 rounded mb-4" />
              <div className="h-8 w-full bg-gray-50 dark:bg-gray-800 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
