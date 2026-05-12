import Link from "next/link";
import { Disc3 } from "lucide-react";
import { siteLinks, type SitePage } from "./site-pages";

export function InfoPage({ page }: { page: SitePage }) {
  return (
    <main className="freecard-app info-app">
      <section className="info-page">
        <div className="crt-overlay" aria-hidden="true" />
        <nav className="top-bar info-nav" aria-label="FreeCard pages">
          <Link href="/" className="brand-stamp" aria-label="FreeCard home">
            <Disc3 size={22} aria-hidden="true" />
            FreeCard
          </Link>
          <div className="site-links">
            {siteLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <Link href="/editor" className="mini-cta">
            Open Editor
          </Link>
        </nav>

        <div className="info-hero">
          <div>
            <p className="ransom-label">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.dek}</p>
          </div>
          <div className="info-scrap-stack" aria-hidden="true">
            {page.scraps.map((scrap, index) => (
              <span key={scrap} style={{ rotate: `${index % 2 ? 5 : -6}deg` }}>
                {scrap}
              </span>
            ))}
          </div>
        </div>

        <div className="info-panels">
          {page.panels.map((panel) => (
            <article key={panel.title}>
              <div className="window-title">
                <span>{panel.title}</span>
                <span>FREE</span>
              </div>
              <p>{panel.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
