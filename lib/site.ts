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
  titleSuffix: "Writing, networking notes, and useful links.",
  description: "A small archive for systems notes, experiments, and things worth keeping around.",
  availability: "Open for correspondence",
  email: "mailto:xindan.zhang@mail.utoronto.ca",
  github: "https://github.com/XindanZhang",
  source: "https://github.com/XindanZhang/personal-site",
  home: {
    quote:
      "I use this site as a public notebook for networking, systems work, and small software observations.",
    body: "Most of what lives here starts as a short note: a setup detail, a useful link, or an idea that should not stay buried in a private scratch file.",
    sideTitle: "Focus",
    sideNotes: [
      "Keep the setup simple.",
      "Write down what you learn.",
      "Prefer durable notes over forgotten drafts.",
    ],
    blogSummary: "Posts, notes, and references collected in one archive.",
    projectsSummary: "A few living pages inside this site and the repositories behind them.",
  },
  blog: {
    description: "Writing about systems, networking, terminals, and whatever is worth keeping around.",
  },
  friendsIntro: "Sites and people I keep returning to.",
  about: {
    intro: "Hi, I'm Xindan Zhang, and I use this site to keep notes, posts, and small experiments in one place.",
    body: "The writing here is practical on purpose: terminals, networking, deployment details, and software tools that are easier to understand once they are written down clearly.",
  },
  projects: [
    {
      name: "Nextmini Notes",
      description: "A running thread of notes about Nextmini, controller internals, and related experiments.",
      status: "featured",
      tags: ["networking", "series", "notes"],
      href: "/blog/series/nextmini/",
      hrefLabel: "Visit",
    },
    {
      name: "Blog Archive",
      description: "The full writing archive for this site, including short notes and series pages.",
      status: "featured",
      tags: ["writing", "archive", "blog"],
      href: "/blog/",
      hrefLabel: "Visit",
    },
    {
      name: "GitHub Profile",
      description: "Public repositories, experiments, and the code that feeds this site.",
      status: "active",
      tags: ["github", "code", "profile"],
      href: "https://github.com/XindanZhang",
      hrefLabel: "GitHub",
      external: true,
    },
    {
      name: "Site Source",
      description: "The repository for this Next.js and Tailwind-powered personal site.",
      status: "active",
      tags: ["next.js", "tailwind", "source"],
      href: "https://github.com/XindanZhang/personal-site",
      hrefLabel: "GitHub",
      external: true,
    },
    {
      name: "Personal Site",
      description: "Static publishing on GitHub Pages with a single archive-first layout.",
      status: "active",
      tags: ["static-export", "github-pages", "website"],
      href: "/",
      hrefLabel: "Visit",
    },
    {
      name: "Jekyll Setup Log",
      description: "An older build note that still documents how the blog started out before this migration.",
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
      name: "AprilNEA",
      note: "An engineering blog with a clean archive structure and strong visual shell.",
      href: "https://aprilnea.me/en",
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
