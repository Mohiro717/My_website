import React, { useRef, useEffect, useState } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'bounce';
  delay?: number;
  duration?: number;
  threshold?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay, threshold]);

  const getAnimationClass = () => {
    const durationClass = duration <= 0.3 ? 'duration-300' :
                          duration <= 0.5 ? 'duration-500' :
                          duration <= 0.7 ? 'duration-700' :
                          duration <= 1.0 ? 'duration-1000' :
                          'duration-1000';
    
    const baseTransition = `transition-all ${durationClass} ease-out`;
    
    switch (animation) {
      case 'fadeUp':
        return `${baseTransition} ${
          isVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-8'
        }`;
      case 'fadeIn':
        return `${baseTransition} ${
          isVisible 
            ? 'opacity-100' 
            : 'opacity-0'
        }`;
      case 'slideLeft':
        return `${baseTransition} ${
          isVisible 
            ? 'opacity-100 transform translate-x-0' 
            : 'opacity-0 transform translate-x-8'
        }`;
      case 'slideRight':
        return `${baseTransition} ${
          isVisible 
            ? 'opacity-100 transform translate-x-0' 
            : 'opacity-0 transform -translate-x-8'
        }`;
      case 'scale':
        return `${baseTransition} ${
          isVisible 
            ? 'opacity-100 transform scale-100' 
            : 'opacity-0 transform scale-95'
        }`;
      case 'bounce':
        return `${baseTransition} ${
          isVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-4'
        } ${isVisible ? 'animate-bounce-once' : ''}`;
      default:
        return baseTransition;
    }
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;