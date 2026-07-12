import { Link, createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "~/lib/site";

const VIDEO_URL = "/personal-site/assets/vintage-computer-only.mp4";
const POSTER_URL = "/personal-site/assets/vintage-computer-only-poster.webp";
const SENSITIVITY = 0.8;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Xindan Zhang — Systems, networks, and field notes" },
      { name: "description", content: site.description },
      { property: "og:title", content: "Xindan Zhang — Systems, networks, and field notes" },
      { property: "og:description", content: site.description },
    ],
  }),
  component: HomePage,
});

function useTypewriter(text: string, speed = 34, startDelay = 420) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let intervalId: number | undefined;
    const delayId = window.setTimeout(() => {
      let index = 0;
      intervalId = window.setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          if (intervalId) window.clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(delayId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [speed, startDelay, text]);

  return { displayed, done };
}

function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const previousXRef = useRef<number | null>(null);
  const targetTimeRef = useRef(0);
  const queuedSeekRef = useRef(false);
  const [videoReady, setVideoReady] = useState(false);
  const { displayed, done } = useTypewriter(site.home.heroTitle);

  const seekToTarget = useCallback(() => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    if (video.seeking) {
      queuedSeekRef.current = true;
      return;
    }

    const nextTime = Math.min(video.duration, Math.max(0, targetTimeRef.current));
    if (Math.abs(video.currentTime - nextTime) < 0.001) return;
    queuedSeekRef.current = false;
    video.currentTime = nextTime;
  }, []);

  useEffect(() => {
    videoRef.current?.load();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const handleMouseMove = (event: MouseEvent) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

      if (previousXRef.current === null) {
        previousXRef.current = event.clientX;
        targetTimeRef.current = video.currentTime;
        return;
      }

      const delta = event.clientX - previousXRef.current;
      previousXRef.current = event.clientX;
      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTimeRef.current = Math.min(video.duration, Math.max(0, targetTimeRef.current + offset));
      seekToTarget();
    };

    const resetPointer = () => {
      previousXRef.current = null;
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      const video = videoRef.current;
      if (!touch || !video) return;
      previousXRef.current = touch.clientX;
      targetTimeRef.current = video.currentTime;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      const video = videoRef.current;
      if (!touch || !video || previousXRef.current === null || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const delta = touch.clientX - previousXRef.current;
      previousXRef.current = touch.clientX;
      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTimeRef.current = Math.min(video.duration, Math.max(0, targetTimeRef.current + offset));
      seekToTarget();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.documentElement.addEventListener("mouseleave", resetPointer);
    const stage = stageRef.current;
    stage?.addEventListener("touchstart", handleTouchStart, { passive: true });
    stage?.addEventListener("touchmove", handleTouchMove, { passive: true });
    stage?.addEventListener("touchend", resetPointer, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", resetPointer);
      document.documentElement.removeEventListener("mouseleave", resetPointer);
      stage?.removeEventListener("touchstart", handleTouchStart);
      stage?.removeEventListener("touchmove", handleTouchMove);
      stage?.removeEventListener("touchend", resetPointer);
    };
  }, [seekToTarget]);

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;
    setVideoReady(true);
    const shouldContinue = queuedSeekRef.current || Math.abs(video.currentTime - targetTimeRef.current) > 0.01;
    queuedSeekRef.current = false;
    if (shouldContinue) seekToTarget();
  };

  return (
    <section className="personal-hero" aria-labelledby="home-title">
      <div className="personal-hero-grid">
        <div className="personal-hero-copy">
          <p className="personal-hero-kicker"><span className="status-dot" /> U of T ECE · field notes</p>
          <h1 id="home-title">Tracing systems.<br />Keeping the useful parts.</h1>
          <p className="personal-hero-typewriter">
            {displayed}
            {!done ? <span className="typewriter-cursor" aria-hidden="true" /> : null}
          </p>

          <div className="personal-hero-actions">
            <Link className="personal-action is-primary" to="/projects/">Selected work</Link>
            <Link className="personal-action" to="/blog/">Read writing</Link>
            <Link className="personal-text-link" to="/about/">About me</Link>
          </div>
        </div>

        <figure ref={stageRef} className="computer-stage" aria-label="Animated vintage computer character">
          <img
            className={`computer-poster ${videoReady ? "is-hidden" : ""}`}
            src={POSTER_URL}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
          />
          <video
            ref={videoRef}
            className={`computer-video ${videoReady ? "is-ready" : ""}`}
            muted
            playsInline
            preload="auto"
            poster={POSTER_URL}
            onLoadedMetadata={(event) => {
              const initialTime = event.currentTarget.duration * 0.26;
              targetTimeRef.current = initialTime;
              event.currentTarget.currentTime = initialTime;
            }}
            onSeeked={handleSeeked}
            aria-hidden="true"
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
          <figcaption><span /> move sideways to explore</figcaption>
        </figure>
      </div>
    </section>
  );
}
