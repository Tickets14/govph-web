export default function AgenciesLoading() {
  return (
    <div>
      {/* PageHeader skeleton */}
      <div className="bg-navy-dark px-4 sm:px-6 lg:px-8 py-10 text-center">
        <div className="h-7 w-56 bg-white/10 rounded mx-auto mb-2" />
        <div className="h-4 w-40 bg-white/10 rounded mx-auto" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/[0.07] p-5 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl" />
                <div className="h-4 w-32 bg-gray-100 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-3 w-20 bg-gray-100 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
