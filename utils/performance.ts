// Performance monitoring utilities for background images

export interface ImageLoadMetrics {
  url: string;
  loadTime: number;
  fileSize?: number;
  fromCache: boolean;
  screenSize: string;
  devicePixelRatio: number;
  timestamp?: number;
}

class PerformanceMonitor {
  private metrics: ImageLoadMetrics[] = [];

  recordImageLoad(metrics: ImageLoadMetrics) {
    this.metrics.push({
      ...metrics,
      timestamp: Date.now()
    });

    // Development mode logging
    if (process.env.NODE_ENV === 'development') {
      console.log('🖼️ Image Load Metrics:', metrics);
    }
  }

  getAverageLoadTime(): number {
    if (this.metrics.length === 0) return 0;
    return this.metrics.reduce((sum, m) => sum + m.loadTime, 0) / this.metrics.length;
  }

  getCacheHitRate(): number {
    if (this.metrics.length === 0) return 0;
    const cacheHits = this.metrics.filter(m => m.fromCache).length;
    return (cacheHits / this.metrics.length) * 100;
  }

  getMetricsByScreenSize() {
    const grouped = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.screenSize]) acc[metric.screenSize] = [];
      acc[metric.screenSize].push(metric);
      return acc;
    }, {} as Record<string, ImageLoadMetrics[]>);

    return Object.entries(grouped).map(([size, metrics]) => ({
      screenSize: size,
      count: metrics.length,
      avgLoadTime: metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length,
      cacheHitRate: (metrics.filter(m => m.fromCache).length / metrics.length) * 100
    }));
  }

  logSummary() {
    if (process.env.NODE_ENV !== 'development') return;

    console.group('🚀 Background Image Performance Summary');
    console.log(`Average Load Time: ${this.getAverageLoadTime().toFixed(2)}ms`);
    console.log(`Cache Hit Rate: ${this.getCacheHitRate().toFixed(1)}%`);
    console.log(`Total Images Loaded: ${this.metrics.length}`);
    
    const byScreenSize = this.getMetricsByScreenSize();
    if (byScreenSize.length > 0) {
      console.table(byScreenSize);
    }
    console.groupEnd();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Auto-log summary every 10 image loads in development
let loadCounter = 0;
export const trackImageLoad = (metrics: ImageLoadMetrics) => {
  performanceMonitor.recordImageLoad(metrics);
  loadCounter++;
  
  if (loadCounter % 10 === 0 && process.env.NODE_ENV === 'development') {
    performanceMonitor.logSummary();
  }
};
