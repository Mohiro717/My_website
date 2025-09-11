
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardClasses = `
    bg-white/80 dark:bg-gray-800/80
    backdrop-blur-sm
    rounded-lg 
    shadow-md 
    hover:shadow-xl 
    hover:bg-white/90 dark:hover:bg-gray-800/90
    transition-all 
    duration-300 
    overflow-hidden 
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
