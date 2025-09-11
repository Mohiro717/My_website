import React, { useState, useEffect, useRef } from 'react';
import { trackImageLoad } from '../../utils/performance';
import { checkImageFormatSupport, generateOptimizedImageUrls, IMAGE_OPTIMIZATION_CONFIG } from '../../utils/imageOptimizer';

interface CustomBackgroundProps {
  imagePath: string; // 元の画像パス（PNG等）
  className?: string;
  priority?: boolean;
}

const CustomBackground: React.FC<CustomBackgroundProps> = ({
  imagePath,
  className,
  priority = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [isVisible, setIsVisible] = useState(priority);
  const [formatSupport, setFormatSupport] = useState({ webp: false, avif: false });
  const containerRef = useRef<HTMLDivElement>(null);

  // フォーマットサポートチェック
  useEffect(() => {
    checkImageFormatSupport().then(setFormatSupport);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!priority && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [priority]);

  useEffect(() => {
    if (!isVisible || !imagePath) return;

    const loadOptimalImage = async () => {
      const screenWidth = window.innerWidth;
      const pixelRatio = window.devicePixelRatio || 1;

      // 最適な画像サイズを選択
      let optimalWidth: number;
      if (screenWidth <= 768) {
        optimalWidth = 800;
      } else if (screenWidth <= 1200) {
        optimalWidth = 1200;
      } else {
        optimalWidth = 1920;
      }

      const targetWidth = Math.ceil(optimalWidth * pixelRatio);

      // WebP画像を直接使用（既に最適化済み）
      const optimizedImageUrl = imagePath;

      // 高品質画像をプリロード
      const loadStartTime = performance.now();
      const img = new Image();
      
      img.onload = () => {
        const loadTime = performance.now() - loadStartTime;
        setCurrentImageUrl(optimizedImageUrl);
        setIsLoaded(true);

        // パフォーマンス監視
        trackImageLoad({
          url: optimizedImageUrl,
          loadTime,
          fromCache: false,
          screenSize: `${screenWidth}x${window.innerHeight}`,
          devicePixelRatio: pixelRatio
        });

        console.log(`🖼️ Custom Background Loaded: WebP (${loadTime.toFixed(2)}ms)`);
      };

      img.onerror = () => {
        console.error('背景画像の読み込みに失敗しました:', optimizedImageUrl);
        // フォールバック: グラデーション背景を使用
        setIsLoaded(true);
      };

      img.src = optimizedImageUrl;
    };

    loadOptimalImage();
  }, [isVisible, imagePath, formatSupport]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-10 transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-60'
      } ${className || ''}`}
      style={{
        backgroundImage: currentImageUrl ? `url(${currentImageUrl})` : 'none',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#F8F8F8',
      }}
    >
      {/* グラデーションオーバーレイ - 背景画像の上に軽いオーバーレイを追加してコンテンツを読みやすくする */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/15" />
      
      {/* 読み込み状態インジケーター（開発時のみ） */}
      {process.env.NODE_ENV === 'development' && !isLoaded && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
          背景画像読み込み中...
        </div>
      )}
    </div>
  );
};

export default CustomBackground;