import { ChevronsRight, Crosshair, Magnet, Radio } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { TacticalBackdrop } from "~/components/tactical-backdrop";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Vyron | Game Zone" },
      { name: "description", content: "An interactive Three.js operator scene for Vyron." },
    ],
    links: [
      { rel: "canonical", href: "https://xindanzhang.github.io/personal-site/games/" },
      { rel: "preload", href: "/personal-site/images/delta-force-yard-v2.webp", as: "image", type: "image/webp" },
    ],
  }),
  component: GamesPage,
});

function GamesPage() {
  return (
    <section className="game-zone" aria-labelledby="game-zone-title">
      <TacticalBackdrop />

      <header className="game-topline">
        <p><span>gti://operator</span> deploy --unit vyron</p>
        <div><i className="live-dot" aria-hidden="true" /> LINKED <Radio aria-hidden="true" size={13} /></div>
      </header>

      <div className="game-content game-content-minimal">
        <p className="game-kicker">ASSAULT / ACTIVE</p>
        <h1 id="game-zone-title"><span>OPERATOR 07</span>VYRON</h1>
        <div className="vyron-kit" aria-label="Vyron equipment">
          <span><ChevronsRight aria-hidden="true" size={14} /> DASH</span>
          <span><Crosshair aria-hidden="true" size={14} /> QLL32</span>
          <span><Magnet aria-hidden="true" size={14} /> MAG</span>
        </div>
      </div>

      <footer className="game-telemetry" aria-label="Scene telemetry">
        <span>DYNAMIC AUXILIARY // ONLINE</span><i /><span>3D SCENE // ACTIVE</span>
      </footer>
    </section>
  );
}
