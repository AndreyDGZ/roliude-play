import React from 'react';

interface CordelPatternProps {
  className?: string;
  variant?: 'light' | 'dark' | 'subtle';
}

export const CordelPattern: React.FC<CordelPatternProps> = ({
  className = '',
  variant = 'subtle'
}) => {
  const colorClass = variant === 'dark' 
    ? 'text-[#4A2818]/60 fill-[#4A2818]/60' 
    : variant === 'light' 
      ? 'text-[#E2C99B] fill-[#E2C99B]' 
      : 'text-[#D97706]/40 fill-[#D97706]/40';

  return (
    <div className={`w-full overflow-hidden flex items-center justify-center select-none py-1.5 ${className}`}>
      <div className={`flex items-center space-x-6 text-xs tracking-widest font-mono opacity-80 ${colorClass}`}>
        <span>◈◇◈</span>
        <span>||| ● |||</span>
        <span>❖</span>
        <span>✦ ✦ ✦</span>
        <span>◎ ⊙ ◎</span>
        <span>❖</span>
        <span>||| ● |||</span>
        <span>◈◇◈</span>
        <span className="hidden md:inline">❖</span>
        <span className="hidden md:inline">✦ ✦ ✦</span>
        <span className="hidden md:inline">◎ ⊙ ◎</span>
        <span className="hidden lg:inline">||| ● |||</span>
        <span className="hidden lg:inline">◈◇◈</span>
      </div>
    </div>
  );
};
