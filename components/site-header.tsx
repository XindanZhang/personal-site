import Link from "next/link";
import { site } from "../lib/site";

const stripColors = [
  "#c41e3a",
  "#e85d04",
  "#1e4d8c",
  "#2563eb",
  "#06b6d4",
  "#d4a72c",
  "#a855f7",
  "#1e1e1e",
  "#e5e5e5",
  "#d4d4d4",
  "#c4c4c4",
  "#b4b4b4",
  "#a4a4a4",
  "#949494",
  "#1e1e1e",
  "#177a45",
  "#2563eb",
  "#7c3aed",
  "#c41e3a",
  "#e85d04",
];

const navClassName = `
  relative flex-1 px-1.5 py-1.5 tablet:px-4 border border-black bg-white
  font-mono text-xs tablet:text-sm font-medium text-black text-center
  shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-100
  hover:translate-x-[1px] hover:translate-y-[1px]
  hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]
  active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
`;

type NavKey = "home" | "blog" | "projects" | "friends" | "about";

interface SiteHeaderProps {
  active: NavKey;
}

export function SiteHeader({ active }: SiteHeaderProps) {
  const links = [
    { key: "home", label: "Home", href: "/" },
    { key: "blog", label: "Blog", href: "/blog/" },
    { key: "projects", label: "Projects", href: "/projects/" },
    { key: "friends", label: "Friends", href: "/friends/" },
    { key: "about", label: "About", href: "/about/" },
  ] as const;

  return (
    <header className="w-full">
      <div className="flex items-center gap-4 py-3">
        <Link className="font-mono text-base font-bold tracking-tight text-black" href="/">
          {site.name}
        </Link>

        <div className="flex h-3 flex-1 border border-black bg-white" aria-hidden="true">
          {stripColors.map((color) => (
            <div key={color} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>

        <a
          className="border border-black bg-white px-2 py-0.5 font-mono text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] transition-all hover:bg-gray-100"
          href={site.github}
          rel="noopener noreferrer"
          target="_blank"
        >
          GH
        </a>
      </div>

      <nav className="flex w-full items-center gap-0.5 tablet:gap-1" aria-label="Primary">
        {links.map((link) => {
          const isActive = active === link.key;

          return (
            <Link key={link.key} className={navClassName} href={link.href}>
              {isActive ? (
                <span className="absolute left-0.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#177a45] tablet:left-2 tablet:h-2 tablet:w-2" />
              ) : null}
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
