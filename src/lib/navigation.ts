export const navigation = [
  { to: "/", label: "Home", command: "01" },
  { to: "/projects/", label: "Projects", command: "02" },
  { to: "/blog/", label: "Blogs", command: "03" },
  { to: "/about/", label: "About", command: "04" },
] as const;

export function getRoutePath(pathname: string) {
  return pathname.replace(/^\/personal-site(?=\/|$)/, "") || "/";
}

export function isRouteActive(routePath: string, target: string) {
  return target === "/" ? routePath === "/" : routePath.startsWith(target.replace(/\/$/, ""));
}
