import React from 'react';
import { Sparkles, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AIBadgeProps {
  confidence?: number;
  text?: string;
  showInfoButton?: boolean;
  className?: string;
}

export const AIBadge: React.FC<AIBadgeProps> = ({
  confidence,
  text,
  showInfoButton = true,
  className = '',
}) => {
  const { t, setIsScoreModalOpen } = useApp();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200/80 shadow-xs ${className}`}
    >
      <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
      <span>{text || t.common.aiAssisted}</span>
      {confidence !== undefined && (
        <span className="bg-sky-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-semibold">
          {confidence}% Confidence
        </span>
      )}
      {showInfoButton && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsScoreModalOpen(true);
          }}
          className="ml-0.5 text-sky-500 hover:text-sky-800 transition-colors"
          title="Explain AI calculation"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
