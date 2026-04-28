"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { ContactForm } from "./ContactForm";
import { CreditCarousel } from "./CreditCarousel";
import { FadeIn } from "./FadeIn";
import { SocialIcons } from "./SocialIcons";
import type { CarouselBlock } from "@/data/credits";
import { translations, type Lang } from "@/lib/i18n";

const CREDITS_SESSION_KEY = "valentina_credits_cache_v1";
/** Slightly under server revalidate (300) so a later visit refreshes in background */
const CLIENT_CACHE_MS = 4 * 60 * 1000;

type SessionPayload = { savedAt: number; blocks: CarouselBlock[] };

function readSessionCredits(): CarouselBlock[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CREDITS_SESSION_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as SessionPayload;
    if (Date.now() - p.savedAt > CLIENT_CACHE_MS) return null;
    if (!Array.isArray(p.blocks)) return null;
    return p.blocks;
  } catch {
    return null;
  }
}

function writeSessionCredits(blocks: CarouselBlock[]) {
  try {
    const payload: SessionPayload = { savedAt: Date.now(), blocks };
    sessionStorage.setItem(CREDITS_SESSION_KEY, JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

export function HomeClient() {
  const [lang, setLang] = useState<Lang>("en");
  const [credits, setCredits] = useState<{
    data: CarouselBlock[] | null;
    error: boolean;
  }>({ data: null, error: false });
  const t = translations[lang];

  useLayoutEffect(() => {
    const cached = readSessionCredits();
    if (cached) {
      setCredits({ data: cached, error: false });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/credits")
      .then((res) => {
        if (!res.ok) throw new Error("credits");
        return res.json() as Promise<CarouselBlock[]>;
      })
      .then((blocks) => {
        if (cancelled) return;
        setCredits({ data: blocks, error: false });
        writeSessionCredits(blocks);
      })
      .catch(() => {
        if (cancelled) return;
        setCredits((prev) => {
          if (prev.data) {
            return { data: prev.data, error: false };
          }
          return { data: null, error: true };
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { data, error: creditsError } = credits;
  const creditsLoading = data === null && !creditsError;
  const creditsFailedHard = data === null && creditsError;

  return (
    <>
      {/* ——— Fixed Nav ——— */}
      <header className="site-header">
        <nav className="nav" aria-label="Primary">
          <div className="nav__links">
            <a href="#home">{t.nav.home}</a>
            <span className="nav__sep" aria-hidden="true">·</span>
            <a href="#credits">{t.nav.credits}</a>
            <span className="nav__sep" aria-hidden="true">·</span>
            <a href="#contact">{t.nav.contact}</a>
          </div>
          <div className="nav__social">
            <button
              onClick={() => setLang(lang === "en" ? "es" : "en")}
              className="lang-toggle"
              aria-label={`Switch to ${t.lang === "ES" ? "Spanish" : "English"}`}
            >
              {t.lang}
            </button>
            <SocialIcons />
          </div>
        </nav>
      </header>

      <main>
        {/* ——— Hero ——— */}
        <section id="home" className="hero">
          <div className="hero__top">
            <h1 className="hero__name">
              <span className="hero__line">VALENTINA</span>
              <span className="hero__line">CAILLAUX</span>
            </h1>
            <div className="hero__portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/val-image-hero-section-v2.jpeg"
                alt="Valentina Caillaux"
              />
            </div>
          </div>

          <div
            className="hero__bio"
            dangerouslySetInnerHTML={{ __html: t.hero.bioTop }}
          />

          <a
            href="https://pdflink.to/valentinacaillauxcv/"
            target="_blank"
            rel="noopener noreferrer"
            className="hero__cv-btn"
          >
            {t.hero.cvBtn}
          </a>

          <div
            className="hero__bio"
            dangerouslySetInnerHTML={{ __html: t.hero.bioBottom }}
          />
        </section>

        {/* ——— Credit Carousels (after first paint, via /api + cache) ——— */}
        <section id="credits" className="credits">
          {creditsFailedHard && (
            <p className="credits__status credits__status--error" role="alert">
              {t.creditsUi.creditsError}
            </p>
          )}
          {creditsLoading && (
            <p className="credits__status" aria-live="polite">
              {t.creditsUi.loadingCredits}
            </p>
          )}
          {data
            ? data.map((block, i) => (
                <FadeIn key={block.id} delay={i * 80}>
                  <CreditCarousel
                    title={t.carousels[block.titleKey]}
                    items={block.items}
                    watchYoutubeLabel={t.creditsUi.watchYoutube}
                  />
                </FadeIn>
              ))
            : null}
        </section>

        {/* ——— Contact ——— */}
        <section id="contact" className="contact">
          <FadeIn>
            <h2 className="contact__heading">{t.contact.heading}</h2>
            <p className="contact__email">
              <a href="mailto:valentinacxzu@gmail.com">valentinacxzu@gmail.com</a>
            </p>
            <ContactForm
              messages={{
                ...t.contact.form,
                errors: { ...t.contact.form.errors },
              }}
            />
            <div className="contact__social">
              <SocialIcons size="md" />
            </div>
          </FadeIn>
        </section>
      </main>
    </>
  );
}
