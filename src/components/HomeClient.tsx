"use client";

import { useState } from "react";
import { ContactForm } from "./ContactForm";
import { CreditCarousel } from "./CreditCarousel";
import { FadeIn } from "./FadeIn";
import { SocialIcons } from "./SocialIcons";
import type { CarouselBlock } from "@/data/credits";
import { translations, type Lang } from "@/lib/i18n";

type Props = {
  carousels: CarouselBlock[];
};

export function HomeClient({ carousels }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];

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

        {/* ——— Credit Carousels ——— */}
        <section id="credits" className="credits">
          {carousels.map((block, i) => (
            <FadeIn key={block.id} delay={i * 80}>
              <CreditCarousel
                title={t.carousels[block.titleKey]}
                items={block.items}
                watchYoutubeLabel={t.creditsUi.watchYoutube}
              />
            </FadeIn>
          ))}
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
