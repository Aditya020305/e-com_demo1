import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/80 overflow-hidden">
      {/* Image placeholder — matches aspect-[4/5] from ProductCard */}
      <div className="aspect-[4/5] bg-neutral-800/50 animate-pulse" />

      {/* Content — matches p-4 gap-1.5 from ProductCard */}
      <div className="flex flex-col flex-1 p-4 gap-1.5">
        {/* Category */}
        <div className="h-3 w-16 rounded bg-neutral-800 animate-pulse" />

        {/* Name */}
        <div className="h-4 w-3/4 rounded bg-neutral-800 animate-pulse" />

        {/* Rating row */}
        <div className="flex items-center gap-2 mt-0.5">
          <div className="h-3.5 w-20 rounded bg-neutral-800 animate-pulse" />
          <div className="h-3 w-8 rounded bg-neutral-800 animate-pulse" />
        </div>

        {/* Price — pushed to bottom */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <div className="h-5 w-16 rounded bg-neutral-800 animate-pulse" />
          <div className="h-3 w-12 rounded bg-neutral-800 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
