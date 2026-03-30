export type M3UEntry = {
  name: string;
  url: string;
  groupTitle: string;
  tvgId?: string;
  tvgName?: string;
  tvgLogo?: string;
  duration?: number;
};

const attrPattern = /([\w-]+)="([^"]*)"/g;

export function parseM3U(content: string): M3UEntry[] {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const entries: M3UEntry[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("#EXTINF")) {
      const data = line.replace(/^#EXTINF:-?\d+\s*/, "");
      const attrs: Record<string, string> = {};
      let match;
      while ((match = attrPattern.exec(data)) !== null) {
        attrs[match[1]] = match[2];
      }

      const nameParts = data.split(",");
      const name = nameParts[nameParts.length - 1].trim();
      const nextLine = lines[i + 1] ?? "";

      entries.push({
        name,
        url: nextLine,
        groupTitle: attrs["group-title"] || "",
        tvgId: attrs["tvg-id"],
        tvgName: attrs["tvg-name"],
        tvgLogo: attrs["tvg-logo"],
        duration: Number(line.match(/#EXTINF:([-\d]+)/)?.[1] ?? 0),
      });
      i += 1;
    }
  }

  return entries;
}
