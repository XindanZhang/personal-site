export const navigation = [
  { to: "/", label: "Home", command: "01" },
  { to: "/projects/", label: "Work", command: "02" },
  { to: "/blog/", label: "Writing", command: "03" },
  { to: "/about/", label: "About", command: "04" },
  { to: "/interests/", label: "Interests", command: "05" },
] as const;

export function getRoutePath(pathname: string) {
  return pathname.replace(/^\/personal-site(?=\/|$)/, "") || "/";
}

export function isRouteActive(routePath: string, target: string) {
  return target === "/" ? routePath === "/" : routePath.startsWith(target.replace(/\/$/, ""));
}
