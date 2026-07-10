import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef } from "react";
import type { GameSceneHandle } from "~/lib/game-scene";
import { site } from "~/lib/site";

const backgroundUrl = `${site.basePath}/images/delta-force-yard-v2.webp`;
const operatorUrl = `${site.basePath}/images/vyron-cutout-v2.webp`;

export function TacticalBackdrop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<GameSceneHandle | null>(null);
  const pointerActiveRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let intersecting = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    import("~/lib/game-scene")
      .then(({ createGameScene }) => createGameScene({
        container,
        backgroundUrl,
        operatorUrl,
        reducedMotion,
        onReady: () => {
          if (!cancelled) container.classList.add("is-ready");
        },
        onFallback: () => {
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
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
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
    pointerActiveRef.current = true;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic pointer events do not always have an active browser pointer.
    }
    const point = getPointer(event);
    controllerRef.current?.setPointer(point.x, point.y);
    controllerRef.current?.pulse(point.x, point.y);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" && !pointerActiveRef.current) return;
    const point = getPointer(event);
    controllerRef.current?.setPointer(point.x, point.y);
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    pointerActiveRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (event.pointerType !== "mouse") controllerRef.current?.setPointer(0, 0);
  }

  return (
    <div
      ref={containerRef}
      className="game-scene"
      aria-hidden="true"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={() => {
        pointerActiveRef.current = false;
        controllerRef.current?.setPointer(0, 0);
      }}
    >
      <div className="game-scene-fallback">
        <img className="game-scene-yard" src={backgroundUrl} alt="" width={1774} height={887} fetchPriority="high" />
        <img className="game-scene-operator" src={operatorUrl} alt="" width={887} height={1774} decoding="async" />
      </div>
    </div>
  );
}
