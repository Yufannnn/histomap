import { useEffect, useRef, useState } from 'react';

/**
 * Applies a parallax translateY to a ref element based on scroll position.
 * Writes directly to style.transform for zero-rerender performance.
 */
export function useParallax(ref, speed = 0.1) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId;
    function onScroll() {
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        const offset = (center - viewCenter) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial position
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [ref, speed]);
}

/**
 * Animates a number from 0 to target with easeOutCubic when isVisible flips true.
 */
export function useCountUp(target, isVisible, duration = 1200) {
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isVisible || hasRun.current || target === 0) return;
    hasRun.current = true;

    let start = null;
    let rafId;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setValue(eased * target);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isVisible, target, duration]);

  return value;
}

/**
 * 3D tilt effect following mouse position.
 * No-ops on touch devices.
 */
export function useTilt(ref, { maxDeg = 3, disabled = false } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    // Skip on touch-only devices
    if (window.matchMedia('(hover: none)').matches) return;
    // Skip on reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function handleMove(e) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0 to 1
      const y = (e.clientY - rect.top) / rect.height;    // 0 to 1
      const rotateX = (0.5 - y) * maxDeg * 2;
      const rotateY = (x - 0.5) * maxDeg * 2;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    function handleLeave() {
      el.style.transition = 'transform 0.4s ease';
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      setTimeout(() => { el.style.transition = ''; }, 400);
    }

    function handleEnter() {
      el.style.transition = '';
    }

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [ref, maxDeg, disabled]);
}

/**
 * Parse population strings like "~30 million" or "~5–7 million"
 */
export function parsePopulation(str) {
  if (!str) return { prefix: '', num: 0, suffix: str || '', decimals: 0 };
  const match = str.match(/^([~≈]?\s*)([\d.]+)(?:[–\-]([\d.]+))?\s*(.*)/);
  if (!match) return { prefix: '', num: 0, suffix: str, decimals: 0 };
  const num = parseFloat(match[2]);
  const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0;
  const rangeEnd = match[3] ? `–${match[3]}` : '';
  return {
    prefix: match[1],
    num,
    suffix: rangeEnd ? `${rangeEnd} ${match[4]}`.trim() : (match[4] ? ` ${match[4]}` : ''),
    decimals,
  };
}
