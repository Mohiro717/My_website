import React, { useState, useEffect, useRef } from 'react';
import { trackImageLoad } from '../../utils/performance';

interface OptimizedBackgroundProps {
  className?: string;
  priority?: boolean; // 優先読み込み（Above the fold用）
}

// 画像URLキャッシュ
const imageCache = new Map<string, string>();

const OptimizedBackground: React.FC<OptimizedBackgroundProps> = ({ 
  className, 
  priority = true 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [isVisible, setIsVisible] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intersection Observer for lazy loading (priorityがfalseの場合のみ)
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
    if (!isVisible) return;

    const loadOptimalImage = () => {
      const screenWidth = window.innerWidth;
      const pixelRatio = window.devicePixelRatio || 1;
      
      // 画面サイズに応じて最適な画像サイズを選択
      let optimalWidth: number;
      if (screenWidth <= 768) {
        optimalWidth = 800; // モバイル
      } else if (screenWidth <= 1200) {
        optimalWidth = 1200; // タブレット
      } else {
        optimalWidth = 1920; // デスクトップ
      }

      // 高DPI対応
      const targetWidth = Math.ceil(optimalWidth * pixelRatio);
      
      // WebP対応チェック
      const supportsWebP = (() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').startsWith('data:image/webp');
      })();

      // キャッシュキーの生成
      const cacheKey = `${targetWidth}_${supportsWebP ? 'webp' : 'jpg'}`;
      
      // キャッシュから取得
      if (imageCache.has(cacheKey)) {
        const cachedUrl = imageCache.get(cacheKey)!;
        setCurrentImageUrl(cachedUrl);
        setIsLoaded(true);
        
        // キャッシュヒットの監視
        trackImageLoad({
          url: cachedUrl,
          loadTime: 0, // キャッシュからは即座に読み込み
          fromCache: true,
          screenSize: `${screenWidth}x${window.innerHeight}`,
          devicePixelRatio: pixelRatio
        });
        return;
      }

      // Unsplash URLの最適化
      const baseUrl = 'https://images.unsplash.com/photo-1569176312290-3941a7905183';
      const format = supportsWebP ? '&fm=webp' : '&fm=jpg';
      const quality = '&q=75'; // 品質を75%に設定（バランスの取れた設定）
      const optimizedUrl = `${baseUrl}?w=${targetWidth}&auto=format&fit=crop${format}${quality}&auto=compress`;

      // 低品質プレースホルダー（LQIP）の設定
      const lqipUrl = `${baseUrl}?w=50&auto=format&fit=crop&fm=jpg&q=20&blur=10`;
      
      // LQIPを先に表示
      setCurrentImageUrl(lqipUrl);
      
      // 高品質画像のプリロード
      const loadStartTime = performance.now();
      const img = new Image();
      img.onload = () => {
        const loadTime = performance.now() - loadStartTime;
        setCurrentImageUrl(optimizedUrl);
        imageCache.set(cacheKey, optimizedUrl); // キャッシュに保存
        setIsLoaded(true);

        // パフォーマンス監視
        trackImageLoad({
          url: optimizedUrl,
          loadTime,
          fromCache: false,
          screenSize: `${screenWidth}x${window.innerHeight}`,
          devicePixelRatio: pixelRatio
        });
      };
      img.src = optimizedUrl;
    };

    // 初期読み込み
    loadOptimalImage();

    // リサイズ時の再最適化（デバウンス付き）
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(loadOptimalImage, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 -z-10 transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } ${className || ''}`}
      style={{
        backgroundImage: currentImageUrl ? `url(${currentImageUrl})` : 'none',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#F8F8F8',
      }}
    >
      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
    </div>
  );
};

export default OptimizedBackground;