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
  titleSuffix: "Research on networked systems, source code, and protocol behavior.",
  description: "Research and technical writing on networked systems by Xindan Zhang, a PhD student in ECE at the University of Toronto.",
  email: "mailto:xindan.zhang@mail.utoronto.ca",
  github: "https://github.com/XindanZhang",
  source: "https://github.com/XindanZhang/personal-site",
  home: {
    heroTitle: "I study how networked systems behave, then turn the evidence into clear, reproducible explanations.",
    heroBody:
      "My work begins with source code, packet traces, and controlled experiments. This site records what those investigations reveal.",
    quote: "Read the code. Trace the system. Test the explanation.",
    body: "Each article develops from direct observation into an account that another reader can inspect, reproduce, and question.",
    sideTitle: "Current research",
    sideNotes: [
      "Following controller and dataplane behavior through the Nextmini source tree.",
      "Studying protocol behavior with packet traces and controlled experiments.",
      "Building a clear, durable publishing system for technical work.",
    ],
    blogSummary: "Articles on networked systems, protocol behavior, source code, and implementation.",
    projectsSummary: "Research and publishing projects built from source code, experiments, and careful documentation.",
  },
  blog: {
    description: "Articles on networked systems, protocol behavior, source code, and the tools used to investigate them.",
  },
  about: {
    intro:
      "My research focuses on networked systems: how they behave in practice, how to observe them precisely, and how to explain the results clearly.",
    body:
      "I work from source code, packet traces, and controlled experiments, then turn the findings into accounts that others can inspect, reproduce, and challenge.",
  },
  projects: [
    {
      name: "Nextmini: From Source to Runtime",
      description: "A four-part technical study of Nextmini, tracing controller interfaces, conductor behavior, and lossless execution from source code to runtime.",
      status: "featured",
      tags: ["networked systems", "source analysis", "runtime behavior"],
      href: "/blog/series/nextmini/",
      hrefLabel: "Read the series",
    },
    {
      name: "Personal Site",
      description: "A statically rendered personal site built with TanStack Start and React, featuring a custom Markdown pipeline and automated deployment to GitHub Pages.",
      status: "active",
      tags: ["TanStack Start", "React", "static publishing"],
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
      items: ["Networked systems", "Protocol behavior", "Runtime instrumentation", "Developer tooling", "Static publishing"],
    },
    {
      title: "Web stack",
      items: ["TanStack Start", "React", "TypeScript", "Markdown", "GitHub Pages"],
    },
    {
      title: "Research methods",
      items: ["Source analysis", "Packet tracing", "Controlled experiments", "Technical writing", "Version control"],
    },
  ],
  timeline: [
    {
      year: "2026",
      detail: "Rebuilt this site with TanStack Start, including its editorial interface, Markdown pipeline, and deployment workflow.",
    },
    {
      year: "2025",
      detail: "Began a four-part study of Nextmini, tracing its architecture from controller interfaces to runtime behavior.",
    },
    {
      year: "2024",
      detail: "Started publishing technical guides, interface studies, and reviews in a single, durable archive.",
    },
  ] satisfies TimelineEntry[],
};

export function getProjectsByStatus(status: ProjectStatus) {
  return site.projects.filter((project) => project.status === status);
}
