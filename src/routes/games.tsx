import { Activity, ArrowUpRight, Crosshair, Radio, Shield } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TacticalBackdrop } from "~/components/tactical-backdrop";

const modes = [
  {
    id: "warfare",
    label: "Warfare",
    code: "WF",
    icon: Activity,
    title: "Combined-arms scale",
    body: "Large maps, vehicles, and land-sea-air battles turn every push into a moving systems problem.",
    status: "FRONTLINE / ACTIVE",
  },
  {
    id: "operations",
    label: "Operations",
    code: "OP",
    icon: Crosshair,
    title: "Extract with intent",
    body: "A tactical extraction loop built around preparation, resource decisions, and making it back out.",
    status: "EXTRACTION / READY",
  },
  {
    id: "black-hawk-down",
    label: "Black Hawk Down",
    code: "BHD",
    icon: Shield,
    title: "Campaign pressure",
    body: "A focused campaign mode that trades the open map for close coordination and sustained pressure.",
    status: "CAMPAIGN / LINKED",
  },
] as const;

type ModeId = (typeof modes)[number]["id"];

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Games | Xindan Zhang" },
      { name: "description", content: "Xindan Zhang's immersive fan terminal for Delta Force." },
    ],
    links: [{ rel: "canonical", href: "https://xindanzhang.github.io/personal-site/games/" }],
  }),
  component: GamesPage,
});

function GamesPage() {
  const [activeModeId, setActiveModeId] = useState<ModeId>("warfare");
  const activeMode = modes.find((mode) => mode.id === activeModeId) ?? modes[0];
  const ActiveIcon = activeMode.icon;

  return (
    <section className="game-zone" aria-labelledby="game-zone-title">
      <TacticalBackdrop />

      <header className="game-topline">
        <p><span>xindan@toronto:~/games$</span> launch delta_force --profile XINDAN</p>
        <div><i className="live-dot" /> SIGNAL_LOCKED <Radio aria-hidden="true" size={13} /></div>
      </header>

      <div className="game-content">
        <p className="game-kicker">FAVORITE_GAME / TACTICAL_FILE_05</p>
        <h1 id="game-zone-title"><span>GAME ZONE</span>DELTA FORCE</h1>
        <p className="game-deck">A personal field terminal for the game I keep coming back to: scale, pressure, clean information, and one more deployment.</p>

        <div className="mode-switcher" role="tablist" aria-label="Delta Force modes">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const active = mode.id === activeModeId;
            return (
              <button
                key={mode.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="mode-readout"
                className={active ? "is-active" : ""}
                onClick={() => setActiveModeId(mode.id)}
              >
                <Icon aria-hidden="true" size={13} />
                <span>{mode.code}</span>
                {mode.label}
              </button>
            );
          })}
        </div>

        <div id="mode-readout" className="mode-readout" role="tabpanel">
          <div className="mode-icon"><ActiveIcon aria-hidden="true" size={20} /></div>
          <div><span>{activeMode.status}</span><h2>{activeMode.title}</h2><p>{activeMode.body}</p></div>
        </div>

        <a className="game-launch-link" href="https://www.playdeltaforce.com/" target="_blank" rel="noopener noreferrer">
          OPEN OFFICIAL SITE <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      </div>

      <aside className="operator-dossier" aria-label="Operator callsign">
        <span>OPERATOR_ID / FAVORITE_FILE</span>
        <strong>XINDAN</strong>
        <small>TORONTO_CA // DF-05</small>
      </aside>

      <footer className="game-telemetry" aria-label="Scene telemetry">
        <span>LAT 43.6532 N</span><i /><span>LON 79.3832 W</span><i /><span>PARALLAX ACTIVE</span><i /><span>UNOFFICIAL FAN TERMINAL</span>
      </footer>
    </section>
  );
}
