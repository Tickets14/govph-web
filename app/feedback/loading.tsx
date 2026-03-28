export default function FeedbackLoading() {
  return (
    <div>
      <div className="bg-navy-dark px-4 sm:px-6 lg:px-8 py-10 text-center">
        <div className="h-7 w-40 bg-white/10 rounded mx-auto mb-2" />
        <div className="h-4 w-56 bg-white/10 rounded mx-auto" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/[0.07] p-6 animate-pulse">
          <div className="h-4 w-24 bg-gray-100 dark:bg-gray-700 rounded mb-3" />
          <div className="h-10 w-full bg-gray-50 dark:bg-gray-800 rounded-lg mb-5" />
          <div className="h-4 w-20 bg-gray-100 dark:bg-gray-700 rounded mb-3" />
          <div className="h-28 w-full bg-gray-50 dark:bg-gray-800 rounded-lg mb-5" />
          <div className="h-10 w-28 bg-gray-100 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
