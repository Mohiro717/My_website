// Image optimization utility for custom background images

export interface ImageVariant {
  format: 'webp' | 'avif' | 'jpg' | 'png';
  quality: number;
  width: number;
  url: string;
}

export interface OptimizedImageSet {
  original: string;
  variants: ImageVariant[];
  lqip: string; // Low Quality Image Placeholder
}

// 画像最適化設定
export const IMAGE_OPTIMIZATION_CONFIG = {
  // 品質設定
  quality: {
    webp: 85,
    avif: 80, 
    jpg: 85,
    png: 100 // PNGは可逆圧縮
  },
  
  // レスポンシブサイズ
  breakpoints: [
    { name: 'mobile', width: 800 },
    { name: 'tablet', width: 1200 },
    { name: 'desktop', width: 1920 },
    { name: 'uhd', width: 2560 }
  ],
  
  // LQIP設定
  lqip: {
    width: 64,
    quality: 20,
    blur: 10
  }
};

/**
 * カスタム背景画像のURLを生成
 * @param imagePath - 元画像のパス
 * @param options - 最適化オプション
 */
export const generateOptimizedImageUrls = (
  imagePath: string,
  options: {
    width: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png';
    quality?: number;
  }
): OptimizedImageSet => {
  const { width, format = 'webp', quality } = options;
  
  // 実際の実装では、CDN（Cloudinary、ImageKit等）または
  // ビルド時の画像最適化ツールを使用
  const baseUrl = imagePath.replace(/\.[^/.]+$/, ''); // 拡張子を除去
  
  const variants: ImageVariant[] = [
    // WebP（最優先）
    {
      format: 'webp',
      quality: IMAGE_OPTIMIZATION_CONFIG.quality.webp,
      width,
      url: `${baseUrl}_${width}w_q${quality || IMAGE_OPTIMIZATION_CONFIG.quality.webp}.webp`
    },
    // AVIF（次世代）
    {
      format: 'avif', 
      quality: IMAGE_OPTIMIZATION_CONFIG.quality.avif,
      width,
      url: `${baseUrl}_${width}w_q${quality || IMAGE_OPTIMIZATION_CONFIG.quality.avif}.avif`
    },
    // JPEG（フォールバック）
    {
      format: 'jpg',
      quality: IMAGE_OPTIMIZATION_CONFIG.quality.jpg,
      width,
      url: `${baseUrl}_${width}w_q${quality || IMAGE_OPTIMIZATION_CONFIG.quality.jpg}.jpg`
    }
  ];

  return {
    original: imagePath,
    variants,
    lqip: `${baseUrl}_${IMAGE_OPTIMIZATION_CONFIG.lqip.width}w_q${IMAGE_OPTIMIZATION_CONFIG.lqip.quality}_blur${IMAGE_OPTIMIZATION_CONFIG.lqip.blur}.jpg`
  };
};

/**
 * ブラウザサポートチェック
 */
export const checkImageFormatSupport = (): Promise<{
  webp: boolean;
  avif: boolean;
}> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    const webpSupported = canvas.toDataURL('image/webp').startsWith('data:image/webp');
    
    // AVIF support check (more complex)
    const avifImage = new Image();
    avifImage.onload = () => resolve({ webp: webpSupported, avif: true });
    avifImage.onerror = () => resolve({ webp: webpSupported, avif: false });
    
    // Test AVIF with minimal data URI
    avifImage.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};