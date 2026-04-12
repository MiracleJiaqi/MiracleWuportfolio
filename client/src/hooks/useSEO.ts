/**
 * useSEO — 动态设置页面 title 和 meta description
 * 零依赖，useEffect 实现，页面卸载时自动还原 title
 */
import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
}

export function useSEO({ title, description }: SEOProps) {
  useEffect(() => {
    const prevTitle = document.title;

    // 设置 <title>
    document.title = title;

    // 设置 <meta name="description">
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const prevDesc = metaDesc.getAttribute('content') ?? '';
    metaDesc.setAttribute('content', description);

    // 卸载时还原（避免页面切换残留）
    return () => {
      document.title = prevTitle;
      metaDesc?.setAttribute('content', prevDesc);
    };
  }, [title, description]);
}
