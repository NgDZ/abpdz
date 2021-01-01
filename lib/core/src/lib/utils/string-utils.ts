export function interpolate(text: string, params: string[]) {
  return text
    .replace(
      /(['"]?\{\s*(\d+)\s*\}['"]?)/g,
      (_, match, digit) => params[digit] ?? match
    )
    .replace(/\s+/g, ' ');
}
