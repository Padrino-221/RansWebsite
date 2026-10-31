export function publicAssetPath(path: string) {
  return /^(?:https?:)?\/\//i.test(path) || path.startsWith("/") ? path : `/${path}`;
}
