export default function HomeLoading() {
  return (
    <div className="overflow-hidden">
      {/* Hero skeleton */}
      <section className="relative bg-gradient-to-br from-navy via-navy to-navy-dark overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/[0.07] rounded-full px-4 py-1.5 mb-8 border border-white/[0.1]">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/30" />
            <span className="h-3 w-32 bg-white/10 rounded" />
          </div>
          <div className="h-12 w-80 bg-white/10 rounded-lg mx-auto mb-2" />
          <div className="h-12 w-48 bg-gold/10 rounded-lg mx-auto" />
          <div className="h-4 w-64 bg-white/10 rounded mx-auto mt-6" />
          <div className="mt-10 max-w-2xl mx-auto h-12 bg-white/[0.07] rounded-xl border border-white/[0.1]" />
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </section>

      {/* Featured services skeleton */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-950 dark:to-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="h-3 w-20 bg-gold/20 rounded mb-2" />
            <div className="h-7 w-52 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
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
      </section>
    </div>
  );
}
