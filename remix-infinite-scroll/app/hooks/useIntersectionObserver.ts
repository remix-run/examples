import { useEffect, RefObject, useCallback } from 'react';

interface UseIntersectionObserverProps {
  target: RefObject<Element>;
  onIntersect: () => void;
  enabled?: boolean;
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

export function useIntersectionObserver({
  target,
  onIntersect,
  enabled = true,
  threshold = 0.1,
  rootMargin = '0px',
  root = null,
}: UseIntersectionObserverProps) {
  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onIntersect();
      }
    });
  }, [onIntersect]);

  useEffect(() => {
    if (!enabled) return;

    const element = target.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
      root,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [target, enabled, handleIntersect, threshold, rootMargin, root]);
} 