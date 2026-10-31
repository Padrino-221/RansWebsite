"use client";

import { useEffect } from "react";

export function AosInitializer() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-aos]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(target => target.classList.add("is-visible"));
      return;
    }

    const motionClass = reducedMotion ? "motion-ready-reduced" : "motion-ready";
    document.documentElement.classList.add(motionClass);
    let observer: IntersectionObserver | null = null;
    let secondFrame = 0;
    const frame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          });
        }, { threshold: 0.08, rootMargin: "0px 0px -32px 0px" });

        targets.forEach(target => observer?.observe(target));
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(secondFrame);
      observer?.disconnect();
      document.documentElement.classList.remove(motionClass);
    };
  }, []);

  return null;
}
