import { useEffect } from 'react';

export function usePerformanceMonitoring() {
  useEffect(() => {
    console.log('[Performance] Monitoring initialized');

    // Log performance metrics when available
    if (typeof window !== 'undefined' && 'performance' in window) {
      const logPerformance = () => {
        const perfData = window.performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        console.log('[Performance] Metrics:', {
          loadTime: `${loadTime}ms`,
          domReadyTime: `${domReadyTime}ms`,
          renderTime: `${renderTime}ms`,
          timestamp: new Date().toISOString(),
        });

        // Log memory usage if available
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          console.log('[Performance] Memory:', {
            usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
            totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
            jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`,
          });
        }
      };

      // Wait for load event
      if (document.readyState === 'complete') {
        setTimeout(logPerformance, 0);
      } else {
        window.addEventListener('load', () => {
          setTimeout(logPerformance, 0);
        });
      }
    }

    // Log viewport size
    console.log('[Performance] Viewport:', {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    });
  }, []);
}
