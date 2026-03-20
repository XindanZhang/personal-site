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

export interface FriendLink {
  name: string;
  note: string;
  href: string;
}

export interface TimelineEntry {
  year: string;
  detail: string;
}

export const site = {
  name: "Xindan Zhang",
  titleSuffix: "Networking notes, protocol experiments, and terminal-first build logs.",
  description: "Terminal-first notes on networking, distributed systems, debugging, and the tools worth reopening.",
  availability: "Available for thoughtful collaboration",
  email: "mailto:xindan.zhang@mail.utoronto.ca",
  github: "https://github.com/XindanZhang",
  source: "https://github.com/XindanZhang/personal-site",
  home: {
    heroTitle: "Networking notes, protocol experiments, and terminal logs.",
    heroBody:
      "This site is where I keep the parts of systems work that are easy to lose: commands that fixed something, traces that explained a bug, and notes that stayed useful after the terminal closed.",
    quote:
      "No landing-page theater. Just the logs, diagrams, and writeups that were worth keeping.",
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
  friendsIntro: "A small ring of sites and tools I revisit.",
  about: {
    intro:
      "I am Xindan Zhang. This site is a public scratchpad for systems work, networking experiments, and the shell-heavy workflows that make the results reproducible.",
    body:
      "The goal is simple: keep technical notes concrete enough to rerun, concise enough to scan, and personal enough to reflect how I actually debug and build things.",
  },
  projects: [
    {
      name: "Nextmini Notes",
      description: "A running series on Nextmini internals, controller behavior, and nearby experiments.",
      status: "featured",
      tags: ["networking", "series", "notes"],
      href: "/blog/series/nextmini/",
      hrefLabel: "Visit",
    },
    {
      name: "Blog Archive",
      description: "The complete set of logs, writeups, and longer technical threads published here.",
      status: "featured",
      tags: ["writing", "archive", "blog"],
      href: "/blog/",
      hrefLabel: "Visit",
    },
    {
      name: "GitHub Profile",
      description: "Public repositories, prototypes, and the code that supports this notebook.",
      status: "active",
      tags: ["github", "code", "profile"],
      href: "https://github.com/XindanZhang",
      hrefLabel: "GitHub",
      external: true,
    },
    {
      name: "Site Source",
      description: "The repository for the terminal-style Next.js site you are looking at now.",
      status: "active",
      tags: ["next.js", "tailwind", "source"],
      href: "https://github.com/XindanZhang/personal-site",
      hrefLabel: "GitHub",
      external: true,
    },
    {
      name: "Personal Site",
      description: "A static-exported site with a shell-first interface and a writable build workflow.",
      status: "active",
      tags: ["static-export", "github-pages", "website"],
      href: "/",
      hrefLabel: "Visit",
    },
    {
      name: "Jekyll Setup Log",
      description: "An older migration note that still documents how the site started before the rebuild.",
      status: "archived",
      tags: ["jekyll", "migration", "history"],
      href: "/blog/create-blog-website-using-jekyll/",
      hrefLabel: "Visit",
    },
  ] satisfies ProjectLink[],
  friends: [
    {
      name: "Nextmini",
      note: "Network emulation and experimentation testbed.",
      href: "https://nextmini.org/",
    },
    {
      name: "La Terminal",
      note: "A mobile terminal app that treats long-running sessions as a real workflow.",
      href: "https://la-terminal.net/",
    },
    {
      name: "ArchWiki",
      note: "Documentation that still solves terminal problems faster than most search results.",
      href: "https://wiki.archlinux.org/",
    },
    {
      name: "GitHub Pages",
      note: "A simple deployment target that keeps this site easy to ship.",
      href: "https://pages.github.com/",
    },
  ] satisfies FriendLink[],
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
      title: "Frontend",
      items: ["Next.js", "React", "Tailwind CSS", "Markdown", "GitHub Pages"],
    },
    {
      title: "Workflow",
      items: ["Notes", "Experiments", "Documentation", "CLI tools", "Version control"],
    },
  ],
  timeline: [
    {
      year: "2026",
      detail: "Moved this site onto Next.js and kept adding Nextmini notes, terminal writeups, and archive pages.",
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
