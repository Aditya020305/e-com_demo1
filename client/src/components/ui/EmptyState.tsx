import React from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700">
        {icon || (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-neutral-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        )}
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-neutral-100 mb-2">{title}</h2>

      {/* Description */}
      <p className="text-sm text-neutral-400 opacity-70 max-w-sm mb-6">
        {description}
      </p>

      {/* Action */}
      <Button
        variant="primary"
        size="lg"
        onClick={onAction}
        className="hover:scale-105 transition-transform duration-200"
      >
        {actionLabel}
      </Button>
    </div>
  );
};

export default EmptyState;
