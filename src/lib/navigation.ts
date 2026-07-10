export const navigation = [
  { to: "/", label: "home", command: "1" },
  { to: "/projects/", label: "work", command: "2" },
  { to: "/blog/", label: "notes", command: "3" },
  { to: "/about/", label: "about", command: "4" },
  { to: "/games/", label: "games", command: "5" },
] as const;

export function getRoutePath(pathname: string) {
  return pathname.replace(/^\/personal-site(?=\/|$)/, "") || "/";
}

export function isRouteActive(routePath: string, target: string) {
  return target === "/" ? routePath === "/" : routePath.startsWith(target.replace(/\/$/, ""));
}
