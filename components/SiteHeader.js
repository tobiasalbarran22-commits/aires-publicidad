"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#clientes", label: "Clientes" },
  { href: "#empresa", label: "Empresa" },
  { href: "#servicios", label: "Carteles" },
  { href: "#faq", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
];

export default function SiteHeader({ whatsappHref, phone, telHref }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const scroller = document.querySelector(".snap-scroll") || window;
    const getY = () => (scroller === window ? window.scrollY : scroller.scrollTop);
    const onScroll = () => setScrolled(getY() > 24);
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#top" className="brand">
          <Image
            src="/logo-aires.png"
            alt="Aires Publicidad"
            className="brand-logo"
            width={132}
            height={61}
            priority
          />
        </a>

        <nav className="nav-links-desktop">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          {phone ? (
            <a href={telHref} className="nav-phone">
              {phone}
            </a>
          ) : null}
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            WhatsApp
          </a>
          <button
            type="button"
            className={`nav-toggle ${open ? "is-open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            <span className="hamburger" aria-hidden="true" />
          </button>
        </div>
      </header>

      <nav className={`nav-links-mobile ${open ? "is-open" : ""}`} onClick={() => setOpen(false)}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        {phone ? <a href={telHref}>{phone}</a> : null}
      </nav>
    </>
  );
}
