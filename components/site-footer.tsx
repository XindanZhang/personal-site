import Link from "next/link";
import { site } from "../lib/site";

export function SiteFooter() {
  const year = new Date().getUTCFullYear();
  const copyrightRange = year === 2024 ? "2024" : `2024-${year}`;

  return (
    <footer className="mt-6 border-t border-black py-4 tablet:mt-8">
      <div className="flex flex-col items-center justify-between gap-3 tablet:flex-row tablet:flex-wrap tablet:gap-4">
        <span className="text-center font-mono text-[10px] uppercase tracking-wide tablet:text-xs">
          © COPYRIGHT {copyrightRange}, {site.name.toUpperCase()}. ALL RIGHTS RESERVED.
        </span>

        <div className="flex items-center gap-3">
          <a className="font-mono text-xs uppercase tracking-wide hover:underline" href={site.github}>
            GITHUB
          </a>
          <a className="font-mono text-xs uppercase tracking-wide hover:underline" href={site.email}>
            EMAIL
          </a>
          <Link className="font-mono text-xs uppercase tracking-wide hover:underline" href="/blog/">
            BLOG
          </Link>
        </div>

        <div className="flex items-center gap-1 font-mono text-xs">
          <span className="bg-[#177a45] px-1.5 py-0.5 text-white">PROD</span>
          <span className="border border-black px-1.5 py-0.5">NEXT</span>
        </div>
      </div>
    </footer>
  );
}
