
import React from 'react';

interface TagProps {
  children: React.ReactNode;
  color?: 'blue' | 'pink';
  onClick?: () => void;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, color = 'blue', onClick, className = '' }) => {
  const baseClasses = 'text-xs font-medium px-2.5 py-1 rounded-full transition-colors duration-300';
  
  const colorClasses = {
    blue: 'bg-accent-blue/20 text-blue-800 hover:bg-accent-blue/40',
    pink: 'bg-accent-pink/20 text-pink-800 hover:bg-accent-pink/40',
  };

  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <span className={`${baseClasses} ${colorClasses[color]} ${clickableClasses} ${className}`} onClick={onClick}>
      {children}
    </span>
  );
};

export default Tag;
