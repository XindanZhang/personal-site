export const site = {
  name: "Xindan Zhang",
  role: "PhD student in networking and distributed systems",
  headline: "Building systems prototypes, research tools, and notes that stay useful.",
  intro:
    "I work across networking, distributed systems, and agent tooling. I like turning rough research ideas into small, inspectable software that can be tested, shared, and extended.",
  location: "Toronto, Canada",
  status: "Research mode active",
  availability: "Open to collaborations on systems, tooling, and experiments",
  focusAreas: [
    {
      title: "Distributed systems",
      description:
        "I care about systems that remain understandable while they scale past the toy stage.",
    },
    {
      title: "Networking research",
      description:
        "I like experiments that make network behavior observable instead of hand-wavy.",
    },
    {
      title: "Agent tooling",
      description:
        "I build tools that make AI workflows easier to inspect, compare, and trust.",
    },
  ],
  now: [
    "Exploring observability and memory behavior in coding agents.",
    "Writing compact notes so project context does not disappear between sessions.",
    "Building infrastructure for fast iteration on systems and networking ideas.",
  ],
  links: {
    email: "mailto:xindan.zhang@mail.utoronto.ca",
    github: "https://github.com/XindanZhang",
  },
  projects: [
    {
      name: "Agent Memory Observatory",
      tag: "Rust + UI",
      url: "https://github.com/XindanZhang/agent-memory-observatory",
      description:
        "A Rust CLI and web UI for normalizing agent session artifacts, reconstructing state, and auditing what survives in summaries and handoffs.",
    },
    {
      name: "Oracle",
      tag: "Developer tooling",
      url: "https://github.com/XindanZhang/oracle",
      description:
        "A context-bundling CLI that packages prompts and files so stronger models can review code with the right evidence.",
    },
    {
      name: "Nextmini",
      tag: "Systems research",
      url: "https://nextmini.org/",
      description:
        "A high-performance network emulation and experimentation testbed built for rapid iteration on research workflows.",
    },
    {
      name: "kvcache",
      tag: "Workspace protocol",
      url: "https://github.com/XindanZhang/kvcache",
      description:
        "A long-running workspace for paper threads, experiments, and the protocols needed to keep complex research work coherent over time.",
    },
  ],
};
