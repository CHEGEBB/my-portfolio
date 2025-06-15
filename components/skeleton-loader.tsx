"use client"

export function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Logo Skeleton */}
        <div className="text-center">
          <div className="skeleton h-12 w-48 mx-auto rounded-lg mb-4"></div>
          <div className="skeleton h-6 w-64 mx-auto rounded"></div>
        </div>

        {/* Content Skeleton */}
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-dark p-6 rounded-lg">
              <div className="skeleton h-16 w-16 rounded-lg mb-4"></div>
              <div className="skeleton h-6 w-32 rounded mb-2"></div>
              <div className="skeleton h-4 w-full rounded mb-2"></div>
              <div className="skeleton h-4 w-3/4 rounded"></div>
            </div>
          ))}
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <div className="text-emerald-400 font-mono text-lg gentle-glow">Initializing CHEGEBB Portal...</div>
        </div>
      </div>
    </div>
  )
}
