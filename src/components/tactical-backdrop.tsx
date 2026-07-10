import { useEffect, useRef } from "react";
import { site } from "~/lib/site";

export function TacticalBackdrop() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const pulseTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(pulseTimerRef.current), []);

  function moveScene(clientX: number, clientY: number) {
    const scene = sceneRef.current;
    if (!scene) return;

    const bounds = scene.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((clientX - bounds.left) / bounds.width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((clientY - bounds.top) / bounds.height - 0.5) * 2));
    scene.style.setProperty("--scene-x", `${x * -13}px`);
    scene.style.setProperty("--scene-y", `${y * -9}px`);
    scene.style.setProperty("--hud-x", `${x * 8}px`);
    scene.style.setProperty("--hud-y", `${y * 6}px`);
  }

  function pulseScene(clientX: number, clientY: number) {
    const scene = sceneRef.current;
    if (!scene) return;

    const bounds = scene.getBoundingClientRect();
    scene.style.setProperty("--pulse-x", `${clientX - bounds.left}px`);
    scene.style.setProperty("--pulse-y", `${clientY - bounds.top}px`);
    scene.classList.remove("is-pulsing");
    void scene.offsetWidth;
    scene.classList.add("is-pulsing");
    window.clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = window.setTimeout(() => scene.classList.remove("is-pulsing"), 760);
  }

  function resetScene() {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.style.setProperty("--scene-x", "0px");
    scene.style.setProperty("--scene-y", "0px");
    scene.style.setProperty("--hud-x", "0px");
    scene.style.setProperty("--hud-y", "0px");
  }

  return (
    <div
      ref={sceneRef}
      className="tactical-backdrop"
      aria-hidden="true"
      onPointerDown={(event) => {
        moveScene(event.clientX, event.clientY);
        pulseScene(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => moveScene(event.clientX, event.clientY)}
      onPointerLeave={resetScene}
    >
      <div className="operator-image">
        <img src={`${site.basePath}/images/game-zone-operator.webp`} alt="" width={1774} height={887} decoding="async" fetchPriority="high" />
      </div>
      <div className="tactical-grid" />
      <div className="weather-field" />
      <div className="radar-dial"><i /><i /><i /></div>
      <div className="target-reticle"><i /><i /></div>
      <div className="range-lines"><i /><i /><i /><i /></div>
      <div className="touch-pulse" />
    </div>
  );
}
