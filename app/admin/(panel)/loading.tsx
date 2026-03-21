export default function AdminLoading() {
  return (
    <div className="p-8 animate-fade-in">
      <div className="relative mb-8 rounded-2xl overflow-hidden">
        <div className="bg-[#111b30] px-7 py-6 h-[104px]">
          <div className="h-3 w-24 bg-white/10 rounded mb-2" />
          <div className="h-6 w-48 bg-white/10 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-gray-100 mb-3" />
            <div className="h-6 w-12 bg-gray-100 rounded mb-1" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
          <div className="h-4 w-32 bg-gray-100 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-50 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
          <div className="h-4 w-24 bg-gray-100 rounded mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-50 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
