import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Hook: useScrollToTop
 * 在路由变化时自动滚动到页面顶部
 * 使用方法：在需要滚动到顶部的组件中调用此 Hook
 */
export function useScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // 延迟 100ms 确保 DOM 已更新
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // 平滑滚动
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);
}
