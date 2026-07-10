import { Crosshair, Magnet } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { TacticalBackdrop } from "~/components/tactical-backdrop";

export const Route = createFileRoute("/interests")({
  head: () => ({
    meta: [
      { title: "Interests | Xindan Zhang" },
      { name: "description", content: "Games and interactive experiments." },
    ],
    links: [
      { rel: "canonical", href: "https://xindanzhang.github.io/personal-site/interests/" },
      { rel: "preload", href: "/personal-site/models/cosmic-operator.glb", as: "fetch", type: "model/gltf-binary", crossOrigin: "anonymous" },
    ],
  }),
  component: GamesPage,
});

function GamesPage() {
  return (
    <section className="game-zone" aria-labelledby="game-zone-title">
      <TacticalBackdrop />

      <div className="game-content game-content-minimal">
        <p className="game-kicker">COSMIC GUARDIAN</p>
        <h1 id="game-zone-title">VYRON</h1>
        <div className="vyron-kit" aria-label="Vyron equipment">
          <span><Crosshair aria-hidden="true" size={14} /> QLL32</span>
          <span><Magnet aria-hidden="true" size={14} /> DYNAMIC AUXILIARY</span>
        </div>
      </div>
    </section>
  );
}
