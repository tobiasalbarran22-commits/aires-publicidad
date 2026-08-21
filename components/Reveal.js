"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({ as: Tag = "div", className = "", stagger = false, variant = "", children, ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const base = variant ? `reveal-${variant}` : stagger ? "reveal-stagger" : "reveal";
  const cls = [base, visible ? "is-visible" : "", className].filter(Boolean).join(" ");

  return (
    <Tag ref={ref} className={cls} {...props}>
      {children}
    </Tag>
  );
}
