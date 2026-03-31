"use client";

import { RefObject, useEffect, useRef, useState } from "react";

const REVEAL_SELECTOR =
  ".reveal, .reveal-left, .reveal-scale, .img-reveal";
const INTERACTIVE_SELECTOR = "a, button, [data-hover]";

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
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringPos = useRef({ x: -100, y: -100 });
  const mousePos = useRef({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const canUseCursor = window.matchMedia("(pointer: fine)").matches;
    setEnabled(canUseCursor);

    if (!canUseCursor) return;

    const previousBodyCursor = document.body.style.cursor;
    document.body.style.cursor = "none";

    let raf = 0;

    const setExpanded = (expanded: boolean) => {
      if (!ringRef.current) return;
      ringRef.current.style.width = expanded ? "52px" : "32px";
      ringRef.current.style.height = expanded ? "52px" : "32px";
      ringRef.current.style.borderColor = expanded
        ? "rgba(212,130,42,0.8)"
        : "rgba(212,130,42,0.5)";
    };

    const onMove = (event: MouseEvent) => {
      setVisible(true);
      mousePos.current = { x: event.clientX, y: event.clientY };

      if (dotRef.current) {
        dotRef.current.style.left = `${event.clientX}px`;
        dotRef.current.style.top = `${event.clientY}px`;
      }
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest(
        INTERACTIVE_SELECTOR
      );
      if (target) setExpanded(true);
    };

    const onPointerOut = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest(
        INTERACTIVE_SELECTOR
      );
      if (!target) return;

      const relatedTarget =
        event.relatedTarget instanceof Element
          ? event.relatedTarget.closest(INTERACTIVE_SELECTOR)
          : null;

      if (!relatedTarget) setExpanded(false);
    };

    const animate = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }

      raf = window.requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    raf = window.requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = previousBodyCursor;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled || !visible) return null;

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
