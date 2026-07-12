import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4";
const EMAIL = "hello@mainframe.co";
const SENSITIVITY = 0.8;
const TYPEWRITER_COPY = "Glad you stopped in. Good taste tends to find us. Now, what are we building?";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mainframe® — Creative agency" },
      { name: "description", content: "Mainframe is an independent creative studio building ideas with taste, clarity, and motion." },
    ],
  }),
  component: HomePage,
});

function useTypewriter(text: string, speed = 38, startDelay = 600) {
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
  const previousXRef = useRef<number | null>(null);
  const targetTimeRef = useRef(0);
  const queuedSeekRef = useRef(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { displayed, done } = useTypewriter(TYPEWRITER_COPY);

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
    const revealId = window.setTimeout(() => setActionsVisible(true), 400);
    return () => window.clearTimeout(revealId);
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

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.documentElement.addEventListener("mouseleave", resetPointer);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", resetPointer);
      document.documentElement.removeEventListener("mouseleave", resetPointer);
    };
  }, [seekToTarget]);

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;
    const shouldContinue = queuedSeekRef.current || Math.abs(video.currentTime - targetTimeRef.current) > 0.01;
    queuedSeekRef.current = false;
    if (shouldContinue) seekToTarget();
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="mainframe-home relative z-[1] h-screen overflow-hidden text-black" aria-labelledby="mainframe-title">
      <h1 id="mainframe-title" className="sr-only">Mainframe creative agency</h1>
      <video
        ref={videoRef}
        className="fixed inset-0 z-0 h-full w-full object-cover object-[70%_center]"
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={(event) => { targetTimeRef.current = event.currentTarget.currentTime; }}
        onSeeked={handleSeeked}
        aria-hidden="true"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      <div className="relative z-[1] flex h-screen flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0">
        <div className="relative z-10 max-w-xl">
          <p className="pointer-events-none mb-5 select-none whitespace-pre-line text-[clamp(18px,4vw,26px)] font-normal leading-[1.3] text-black blur-[4px] sm:mb-6">
            {"Hey there, meet A.R.I.A,\nMainframe's Adaptive Response Interface Agent"}
          </p>

          <p className="mb-5 min-h-[54px] text-[clamp(18px,4vw,26px)] font-normal leading-[1.35] text-black sm:mb-6">
            {displayed}
            {!done ? <span className="typewriter-cursor ml-[2px] inline-block h-[1.1em] w-[2px] align-middle bg-black" aria-hidden="true" /> : null}
          </p>

          <div
            className={`mainframe-actions flex flex-wrap gap-y-1 ${actionsVisible ? "is-visible" : "pointer-events-none"}`}
          >
            <a className="mainframe-pill mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]" href={`mailto:${EMAIL}?subject=An idea for Mainframe`}>Pitch us an idea</a>
            <a className="mainframe-pill mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]" href="/personal-site/about/">Come work here</a>
            <a className="mainframe-pill mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]" href={`mailto:${EMAIL}?subject=Hello Mainframe`}>Send a brief hello</a>
            <a className="mainframe-pill mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]" href="/personal-site/projects/">See how we operate</a>
            <button
              className="mainframe-pill mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white bg-transparent px-4 py-[0.3em] text-[13px] text-white transition-colors duration-200 hover:bg-white hover:text-black sm:gap-3 sm:px-5 sm:text-[15px]"
              type="button"
              onClick={copyEmail}
              title={copied ? "Email copied" : "Copy email address"}
            >
              <span>Reach us: <span className="underline underline-offset-1">{EMAIL}</span></span>
              <CopyIcon />
              <span className="sr-only" aria-live="polite">{copied ? "Email copied" : ""}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="3.5" y="0.75" width="7.75" height="7.75" rx="1" stroke="currentColor" strokeWidth="1" />
      <rect x="0.75" y="3.5" width="7.75" height="7.75" rx="1" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
