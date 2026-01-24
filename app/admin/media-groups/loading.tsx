// app/media-group/loading.tsx

export default function MediaGroupLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Skeleton */}
      <div className="h-64 md:h-96 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse">
        <div className="h-full container mx-auto px-4 md:px-6 flex items-center">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-300 dark:bg-gray-700 rounded-full" />
            
            <div className="space-y-4">
              <div className="h-10 md:h-14 bg-gray-300 dark:bg-gray-700 rounded w-64 md:w-96" />
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-80" />
              
              <div className="flex gap-4 mt-6">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-32" />
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-40 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full mb-4 mx-auto" />
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-24 mx-auto mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16" />
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}