import React from 'react';

interface ShimmerProps {
  className?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({ className = '' }) => (
  <div className={`shimmer rounded ${className}`} />
);

export const ArticleCardShimmer: React.FC = () => (
  <div className="card p-4">
    <Shimmer className="w-full h-48 rounded-lg mb-4" />
    <div className="space-y-3">
      <Shimmer className="h-4 w-3/4" />
      <Shimmer className="h-6 w-full" />
      <Shimmer className="h-4 w-1/2" />
      <div className="flex gap-2 pt-2">
        <Shimmer className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-3 w-16" />
        </div>
      </div>
    </div>
  </div>
);

export const ArticlePageShimmer: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <Shimmer className="h-4 w-20 mb-6" />
    <div className="space-y-4 mb-8">
      <Shimmer className="h-6 w-1/4" />
      <Shimmer className="h-10 w-full" />
      <div className="flex items-center gap-4">
        <Shimmer className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Shimmer className="h-4 w-32" />
          <Shimmer className="h-3 w-24" />
        </div>
      </div>
    </div>
    <Shimmer className="w-full h-80 rounded-xl mb-8" />
    <div className="space-y-4">
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-3/4" />
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-5/6" />
    </div>
  </div>
);

export const DashboardShimmer: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="card p-4 flex gap-4">
        <Shimmer className="w-40 h-28 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Shimmer className="h-5 w-3/4" />
          <Shimmer className="h-4 w-1/4" />
          <div className="flex gap-2">
            <Shimmer className="h-6 w-16 rounded-full" />
            <Shimmer className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Shimmer;
