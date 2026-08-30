import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = path.join(process.cwd(), "public", "images");

const palettes = [
  ["#0f172a", "#1e3a8a"],
  ["#134e4a", "#0f766e"],
  ["#3b0764", "#7e22ce"],
  ["#7c2d12", "#c2410c"],
  ["#0c4a6e", "#0284c7"],
  ["#1f2937", "#4b5563"],
  ["#052e16", "#15803d"],
  ["#4c0519", "#be123c"],
];

function svg([from, to], label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#g)"/>
  <g fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="6">
    <path d="M180 520 L600 240 L1020 520"/>
    <path d="M260 520 L260 700 L940 700 L940 520"/>
    <rect x="420" y="560" width="140" height="140"/>
    <rect x="660" y="560" width="180" height="110"/>
  </g>
  <text x="600" y="770" text-anchor="middle" font-family="system-ui, sans-serif" font-size="34" fill="rgba(255,255,255,0.75)">${label}</text>
</svg>
`;
}

await mkdir(outDir, { recursive: true });
await Promise.all(
  palettes.map((palette, index) =>
    writeFile(
      path.join(outDir, `prona-${index + 1}.svg`),
      svg(palette, `Foto ${index + 1}`),
      "utf8",
    ),
  ),
);
console.log(`Generated ${palettes.length} placeholders in ${outDir}`);
