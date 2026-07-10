import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef } from "react";
import type { GameSceneHandle } from "~/lib/game-scene";
import { site } from "~/lib/site";

const modelUrl = `${site.basePath}/models/cosmic-operator.glb`;

export function TacticalBackdrop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<GameSceneHandle | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let intersecting = true;
    let revealFrame = 0;
    let settleFrame = 0;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const cancelReveal = () => {
      window.cancelAnimationFrame(revealFrame);
      window.cancelAnimationFrame(settleFrame);
    };

    const revealPaintedScene = () => {
      cancelReveal();
      revealFrame = window.requestAnimationFrame(() => {
        settleFrame = window.requestAnimationFrame(() => {
          if (!cancelled) container.classList.add("is-ready");
        });
      });
    };

    const syncPlayback = () => {
      const controller = controllerRef.current;
      if (!controller) return;
      if (!document.hidden && intersecting) controller.start();
      else controller.stop();
    };

    const resizeObserver = new ResizeObserver(() => controllerRef.current?.resize());
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      intersecting = entry?.isIntersecting ?? true;
      syncPlayback();
    }, { threshold: 0.05 });
    intersectionObserver.observe(container);
    document.addEventListener("visibilitychange", syncPlayback);
    const handleMotionPreference = (event: MediaQueryListEvent) => controllerRef.current?.setReducedMotion(event.matches);
    motionQuery.addEventListener("change", handleMotionPreference);

    import("~/lib/game-scene")
      .then(({ createGameScene }) => createGameScene({
        container,
        modelUrl,
        reducedMotion: motionQuery.matches,
        onReady: revealPaintedScene,
        onFallback: () => {
          cancelReveal();
          if (!cancelled) container.classList.remove("is-ready");
        },
      }))
      .then((controller) => {
        if (cancelled) {
          controller.dispose();
          return;
        }
        controllerRef.current = controller;
        controller.resize();
        syncPlayback();
      })
      .catch(() => container.classList.remove("is-ready"));

    return () => {
      cancelled = true;
      cancelReveal();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      motionQuery.removeEventListener("change", handleMotionPreference);
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, []);

  function getPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      y: -(((event.clientY - bounds.top) / bounds.height) * 2 - 1),
    };
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const point = getPointer(event);
    controllerRef.current?.setPointer(point.x, point.y);
    controllerRef.current?.pulse(point.x, point.y);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const point = getPointer(event);
    controllerRef.current?.setPointer(point.x, point.y);
  }

  return (
    <div
      ref={containerRef}
      className="game-scene"
      aria-hidden="true"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => controllerRef.current?.setPointer(0, 0)}
    >
      <div className="game-scene-fallback"><i /><i /><i /></div>
    </div>
  );
}
