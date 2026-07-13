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

export interface TimelineEntry {
  year: string;
  detail: string;
}

export const site = {
  basePath: "/personal-site",
  name: "Xindan Zhang",
  shortName: "Cindy",
  titleSuffix: "Networking notes, protocol experiments, and build logs.",
  description: "Technical notes and systems work from a University of Toronto ECE PhD student.",
  email: "mailto:xindan.zhang@mail.utoronto.ca",
  github: "https://github.com/XindanZhang",
  source: "https://github.com/XindanZhang/personal-site",
  home: {
    heroTitle: "I trace networks, build small systems, and keep the results reproducible.",
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
  about: {
    intro:
      "This site is where I keep notes on networking, systems, and reproducible workflows.",
    body:
      "I use this notebook to turn traces, experiments, and implementation details into material I can rerun and revisit.",
  },
  projects: [
    {
      name: "Nextmini Code-Reading Notes",
      description: "A four-part code-reading series on Nextmini internals, controller behavior, lossless paths, and nearby network experiments.",
      status: "featured",
      tags: ["networking", "protocols", "code reading"],
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
  ] satisfies ProjectLink[],
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
      detail: "Moved this site to TanStack Start and rebuilt its interface and publishing workflow.",
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
