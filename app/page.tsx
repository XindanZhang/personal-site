import { Activity, ArrowRight, ArrowUpRight, BookOpen, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PointerGlow } from "../components/pointer-glow";
import { Reveal } from "../components/reveal";
import { SiteLayout } from "../components/site-layout";
import { formatMediumDate, getAllPosts, getSeriesBySlug } from "../lib/blog";
import { site } from "../lib/site";

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);
  const nextmini = getSeriesBySlug("nextmini");

  return (
    <SiteLayout active="home">
      <section className="home-hero" aria-labelledby="home-title">
        <Image
          className="hero-image"
          src={`${site.basePath}/network-field.webp`}
          alt="An abstract optical-glass network carrying blue, coral, and magenta signals"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1180px"
        />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-copy">
          <p className="availability-pill">
            <span className="status-dot" aria-hidden="true" />
            {site.availability}
          </p>
          <p className="hero-eyebrow">Networking / systems / tooling</p>
          <h1 id="home-title">
            Xindan Zhang <span>(Cindy)</span>
          </h1>
          <p className="hero-lede">{site.home.heroTitle}</p>
          <div className="hero-actions">
            <Link className="action-button is-primary" href="/projects/">
              Explore my work <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link className="action-button is-glass" href="/blog/">
              Read field notes <BookOpen aria-hidden="true" size={17} />
            </Link>
            <a className="icon-button hero-mail" href={site.email} aria-label="Email Xindan" title="Email Xindan">
              <Mail aria-hidden="true" size={18} />
            </a>
          </div>
        </div>

        <div className="hero-telemetry glass-surface" aria-label="Current profile details">
          <div>
            <span>Current signal</span>
            <strong>Nextmini</strong>
          </div>
          <div>
            <span>Working mode</span>
            <strong>Trace, simplify, write</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>Toronto, Canada</strong>
          </div>
          <Activity className="telemetry-icon" aria-hidden="true" size={19} />
        </div>
      </section>

      <Reveal as="section" className="home-section current-section" aria-labelledby="current-title">
        <header className="section-header">
          <div>
            <p className="section-index">01 / Current research thread</p>
            <h2 id="current-title">Inside Nextmini</h2>
          </div>
          <p>
            A practical series following a network experiment from controller surface to packet behavior, with the
            implementation details left intact.
          </p>
        </header>

        <div className="series-layout">
          <div className="series-statement">
            <p className="mono-label">nextmini / field guide</p>
            <blockquote>{site.home.quote}</blockquote>
            <a className="text-link" href="https://nextmini.org/" target="_blank" rel="noopener noreferrer">
              Visit Nextmini <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </div>

          <div className="series-list">
            {nextmini?.posts.map((post, index) => (
              <PointerGlow key={post.slug} as="article" className="series-row pointer-glow">
                <Link className="series-row-link" href={`/blog/${post.slug}/`}>
                  <span className="series-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="series-row-copy">
                    <strong>{post.title}</strong>
                    <span>{post.summary}</span>
                  </span>
                  <ArrowRight className="row-arrow" aria-hidden="true" size={18} />
                </Link>
              </PointerGlow>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="home-section writing-section" delay={80} aria-labelledby="writing-title">
        <header className="section-header is-inline">
          <div>
            <p className="section-index">02 / Latest observations</p>
            <h2 id="writing-title">Field notes</h2>
          </div>
          <Link className="text-link" href="/blog/">
            View all writing <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </header>

        <div className="home-posts">
          {recentPosts.map((post, index) => (
            <PointerGlow key={post.slug} as="article" className="home-post pointer-glow">
              <div className="home-post-meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <time dateTime={post.publishedAt.toISOString()}>{formatMediumDate(post.publishedAt)}</time>
              </div>
              <div className="home-post-copy">
                <span className="mono-label">{post.categoryLabel}</span>
                <h3>
                  <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
                </h3>
                <p>{post.summary}</p>
              </div>
              <ArrowUpRight className="row-arrow" aria-hidden="true" size={18} />
            </PointerGlow>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="home-section practice-section" delay={120} aria-labelledby="practice-title">
        <div className="practice-copy">
          <p className="section-index">03 / Working practice</p>
          <h2 id="practice-title">Built around observable behavior.</h2>
          <p>{site.home.heroBody}</p>
          <Link className="action-button is-secondary" href="/about/">
            More about me <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
        <div className="capability-grid">
          {site.skillGroups.map((group) => (
            <div key={group.title} className="capability-group">
              <span>{group.title}</span>
              <p>{group.items.join(" / ")}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </SiteLayout>
  );
}
