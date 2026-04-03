import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Returns a 0→1 progress value as an element scrolls through the viewport.
 * 0 = element just entered the bottom, 1 = element reached the top.
 */
export function useScrollProgress(ref, offset = 0) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      // raw: 0 when bottom of viewport touches top of element, 1 when top of viewport passes bottom
      const raw = (windowH - rect.top + offset) / (windowH + rect.height);
      setProgress(Math.min(Math.max(raw, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, offset]);

  return progress;
}

/**
 * Magnetic effect — returns { x, y } offset based on mouse proximity to element.
 */
export function useMagnetic(ref, strength = 0.3) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * strength;
      const dy = (e.clientY - centerY) * strength;
      setOffset({ x: dx, y: dy });
    };

    const handleLeave = () => setOffset({ x: 0, y: 0 });

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [ref, strength]);

  return offset;
}

/**
 * Smooth scroll-linked value with lerp for buttery animations.
 */
export function useSmoothScroll() {
  const [scrollY, setScrollY] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(null);

  const lerp = useCallback((start, end, factor) => {
    return start + (end - start) * factor;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      targetRef.current = window.scrollY;
    };

    const animate = () => {
      currentRef.current = lerp(currentRef.current, targetRef.current, 0.08);
      setScrollY(currentRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [lerp]);

  return scrollY;
}
