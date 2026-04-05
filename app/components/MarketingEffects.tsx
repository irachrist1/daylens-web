"use client";

import { RefObject, useEffect } from "react";

const REVEAL_SELECTOR =
  ".reveal, .reveal-left, .reveal-scale, .img-reveal";

export function useReveal() {
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const timer = window.setTimeout(() => {
      const elements = document.querySelectorAll(REVEAL_SELECTOR);
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.01, rootMargin: "0px 0px -10px 0px" }
      );

      elements.forEach((element) => observer?.observe(element));
    }, 120);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, []);
}

export function useHeroParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      raf = window.requestAnimationFrame(() => {
        if (!ref.current) return;
        const offset = window.scrollY * 0.22;
        ref.current.style.transform = `translateY(${offset}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, [ref]);
}

export function MarketingCursor() {
  return null;
}
