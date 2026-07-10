export type ProjectStatus = "featured" | "active" | "archived";

export interface ProjectLink {
  name: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
  href: string;
  hrefLabel: string;
  external?: boolean;
}

export interface BookmarkLink {
  name: string;
  note: string;
  href: string;
}

export interface TimelineEntry {
  year: string;
  detail: string;
}

export const site = {
  basePath: "/personal-site",
  name: "Xindan Zhang",
  shortName: "Cindy",
  titleSuffix: "Networking notes, protocol experiments, and build logs.",
  description: "Notes on networking, distributed systems, debugging, and the tools worth reopening.",
  availability: "Available for thoughtful collaboration",
  email: "mailto:xindan.zhang@mail.utoronto.ca",
  github: "https://github.com/XindanZhang",
  source: "https://github.com/XindanZhang/personal-site",
  home: {
    heroTitle: "I trace networks, build small systems, and document what survives the debugging session.",
    heroBody:
      "This site is where I keep the parts of systems work that are easy to lose: commands that fixed something, traces that explained a bug, and notes that stayed useful after the terminal closed.",
    quote: "Trace the behavior. Remove assumptions. Keep the useful part.",
    body: "Most entries begin in the middle of debugging or building, then get cleaned up only after the workflow becomes repeatable.",
    sideTitle: "Current threads",
    sideNotes: [
      "Tracing dataplane behavior in Nextmini and related controller paths.",
      "Keeping terminal notes around tmux, shells, and remote workflows honest.",
      "Turning one-off setup fragments into build logs I can rerun later.",
    ],
    blogSummary: "Recent logs and writeups on networking, debugging, and reproducible setup.",
    projectsSummary: "The code, tooling, and publishing pieces that support the notebook itself.",
  },
  blog: {
    description: "Notes on systems, networking, debugging, and the terminal workflows behind them.",
  },
  bookmarksIntro: "A short list of bookmarks I still reopen.",
  about: {
    intro:
      "I am Xindan Zhang, and I also go by Cindy. This site is a public scratchpad for systems work, networking experiments, and the shell-heavy workflows that make the results reproducible.",
    body:
      "The goal is simple: keep technical notes concrete enough to rerun, concise enough to scan, and personal enough to reflect how I actually debug and build things.",
  },
  projects: [
    {
      name: "Nextmini Research Notes",
      description: "An independent four-part reading of Nextmini internals, controller behavior, lossless paths, and nearby network experiments.",
      status: "featured",
      tags: ["networking", "protocols", "research"],
      href: "/blog/series/nextmini/",
      hrefLabel: "Read series",
    },
    {
      name: "Personal Site",
      description: "A prerendered TanStack Start notebook with a custom Markdown pipeline, accessible themes, and a GitHub Pages release workflow.",
      status: "active",
      tags: ["tanstack", "react", "open source"],
      href: "https://github.com/XindanZhang/personal-site",
      hrefLabel: "View source",
      external: true,
    },
    {
      name: "Vyron Interactive Scene",
      description: "A full-bleed Three.js character study with pointer-driven depth, responsive composition, and mobile interaction.",
      status: "active",
      tags: ["three.js", "interaction", "art direction"],
      href: "/games/",
      hrefLabel: "Enter scene",
    },
  ] satisfies ProjectLink[],
  bookmarks: [
    {
      name: "Nextmini",
      note: "Network emulation and experimentation testbed.",
      href: "https://nextmini.org/",
    },
  ] satisfies BookmarkLink[],
  skillGroups: [
    {
      title: "Languages",
      items: ["Rust", "TypeScript", "Python", "Shell", "C"],
    },
    {
      title: "Topics",
      items: ["Networking", "Systems", "Terminals", "Static sites", "Tooling"],
    },
    {
      title: "Web stack",
      items: ["TanStack Start", "React", "TypeScript", "Markdown", "GitHub Pages"],
    },
    {
      title: "Workflow",
      items: ["Notes", "Experiments", "Documentation", "CLI tools", "Version control"],
    },
  ],
  timeline: [
    {
      year: "2026",
      detail: "Moved this site to TanStack Start, rebuilt it as an editorial portfolio, and kept expanding the Nextmini field notes.",
    },
    {
      year: "2025",
      detail: "Started the Nextmini series and expanded the site into a larger public notebook.",
    },
    {
      year: "2024",
      detail: "Published setup logs, UI notes, and media reviews instead of keeping them in scattered drafts.",
    },
  ] satisfies TimelineEntry[],
};

export function getProjectsByStatus(status: ProjectStatus) {
  return site.projects.filter((project) => project.status === status);
}
