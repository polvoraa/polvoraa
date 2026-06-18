const fs = require("node:fs/promises");
const path = require("node:path");
const puppeteer = require("puppeteer");
const { PNG } = require("pngjs");
const { GIFEncoder, quantize, applyPalette } = require("gifenc");

const USERNAME = "polvoraa";
const WIDTH = 1280;
const HEIGHT = 540;
const FRAME_COUNT = 96;
const FRAME_MS = 45;
const OUTPUT_PATH = path.join(__dirname, "profile-snake.gif");

const BOARD_COLS = 8;
const BOARD_ROWS = 13;
const CELL = 26;
const GAP = 7;
const BOARD_WIDTH = BOARD_COLS * CELL + (BOARD_COLS - 1) * GAP;
const BOARD_HEIGHT = BOARD_ROWS * CELL + (BOARD_ROWS - 1) * GAP;
const PANEL_X = 24;
const PANEL_Y = 24;
const PANEL_WIDTH = WIDTH - PANEL_X * 2;
const PANEL_HEIGHT = HEIGHT - PANEL_Y * 2;
const BOARD_X = 420;
const BOARD_Y = 58;

const fallbackProfile = {
  login: "polvoraa",
  name: "Matheus Saraiva",
  avatar_url:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'%3E%3Crect width='320' height='320' rx='72' fill='%23202022'/%3E%3Ccircle cx='160' cy='122' r='56' fill='%23f4f4f5' opacity='.92'/%3E%3Cpath d='M68 284c16-64 64-96 92-96s76 32 92 96' fill='%23f4f4f5' opacity='.82'/%3E%3C/svg%3E",
  bio: "Building digital experiences through design, development and AI.",
  company: "Founder at Nova Studio",
  location: "Remote Studio",
  public_repos: 24,
  followers: 128,
  following: 37,
};

const fallbackRepos = [
  { stargazers_count: 42, updated_at: "2026-03-18T00:00:00Z" },
  { stargazers_count: 31, updated_at: "2026-02-10T00:00:00Z" },
  { stargazers_count: 26, updated_at: "2026-01-20T00:00:00Z" },
];

const paletteLevels = [
  { dot: "#1f1f22", fill: "#202022", border: "rgba(255,255,255,0.05)" },
  { dot: "#1c3b24", fill: "#1a2d1f", border: "rgba(161,218,163,0.14)" },
  { dot: "#2c7f3b", fill: "#20391f", border: "rgba(76,175,93,0.22)" },
  { dot: "#4dc065", fill: "#1e4225", border: "rgba(42,153,66,0.30)" },
  { dot: "#8cf08f", fill: "#234f29", border: "rgba(35,122,53,0.38)" },
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "Mozilla/5.0",
    },
  });
  if (!response.ok) throw new Error(`GitHub page error: ${response.status}`);
  return response.text();
}

async function loadGitHubData() {
  if (!USERNAME || USERNAME === "SEU_USUARIO") {
    return { profile: fallbackProfile, repos: fallbackRepos, levels: [] };
  }

  const [profile, repos, contributionsHtml] = await Promise.all([
    fetchJson(`https://api.github.com/users/${USERNAME}`),
    fetchJson(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`),
    fetchText(`https://github.com/users/${USERNAME}/contributions`),
  ]);

  return { profile, repos, levels: parseContributionLevels(contributionsHtml) };
}

function getTotalStars(repos) {
  return repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
}

function parseContributionLevels(html) {
  const cells = [];
  const regex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    cells.push({ date: match[1], level: Number(match[2]) });
  }

  cells.sort((a, b) => a.date.localeCompare(b.date));

  const normalized = cells.map((cell) => cell.level);
  const expected = BOARD_COLS * BOARD_ROWS;
  if (normalized.length >= expected) {
    return normalized.slice(normalized.length - expected);
  }

  return [...Array(expected - normalized.length).fill(0), ...normalized];
}

function buildActivityLevels(levels, repos) {
  if (levels.length) {
    return levels.slice(0, BOARD_COLS * BOARD_ROWS);
  }

  const fallback = [];
  for (let index = 0; index < BOARD_COLS * BOARD_ROWS; index += 1) {
    const repoSignal = repos[index % Math.max(repos.length, 1)]?.stargazers_count || 0;
    fallback.push((index * 7 + repoSignal) % 5);
  }
  return fallback;
}

function buildPathPoints() {
  const points = [];
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      const xCell = row % 2 === 0 ? col : BOARD_COLS - 1 - col;
      const x = BOARD_X + xCell * (CELL + GAP) + CELL / 2;
      const y = BOARD_Y + row * (CELL + GAP) + CELL / 2;
      points.push({ x, y });
    }
  }
  return points;
}

function pointAt(points, progress) {
  const clamped = Math.max(0, Math.min(points.length - 1, progress));
  const index = Math.floor(clamped);
  const nextIndex = Math.min(points.length - 1, index + 1);
  const t = clamped - index;
  const a = points[index];
  const b = points[nextIndex];
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

function cellRect(index) {
  const row = Math.floor(index / BOARD_COLS);
  const col = row % 2 === 0 ? index % BOARD_COLS : BOARD_COLS - 1 - (index % BOARD_COLS);
  return {
    x: BOARD_X + col * (CELL + GAP),
    y: BOARD_Y + row * (CELL + GAP),
  };
}

function renderSvg({ profile, repos, levels, frameIndex, points }) {
  const progress = (frameIndex / FRAME_COUNT) * (points.length - 1);
  const headIndex = Math.floor(progress);
  const bodySegments = 14;

  const body = [];
  for (let i = 0; i < bodySegments; i += 1) {
    const segmentProgress = Math.max(0, progress - i * 0.9);
    const p = pointAt(points, segmentProgress);
    const alpha = Math.max(0.18, 0.9 - i * 0.05);
    const radius = Math.max(5, 12 - i * 0.42);
    body.push(
      `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${radius.toFixed(2)}" fill="rgba(157,245,136,${alpha.toFixed(2)})"/>`,
    );
  }

  const cells = levels
    .map((level, index) => {
      const rect = cellRect(index);
      const visited = index <= headIndex;
      const palette = paletteLevels[level];
      const dotOpacity = visited ? 0.12 : 0.98;
      const fillOpacity = visited ? 0.6 : 1;
      const dotRadius = 4 + level * 0.55;
      const cx = rect.x + CELL / 2;
      const cy = rect.y + CELL / 2;

      return `
        <rect x="${rect.x}" y="${rect.y}" width="${CELL}" height="${CELL}" rx="7" fill="${palette.fill}" stroke="${palette.border}" />
        <circle cx="${cx}" cy="${cy}" r="${dotRadius}" fill="${palette.dot}" opacity="${dotOpacity}" style="filter: drop-shadow(0 0 6px rgba(120,255,140,0.18));" />
        <rect x="${rect.x + 1}" y="${rect.y + 1}" width="${CELL - 2}" height="${CELL - 2}" rx="6" fill="none" stroke="rgba(255,255,255,${(0.03 * fillOpacity).toFixed(2)})" />
      `;
    })
    .join("");

  const head = pointAt(points, progress);
  const glow = `
    <circle cx="${head.x.toFixed(2)}" cy="${head.y.toFixed(2)}" r="22" fill="rgba(111,255,145,0.10)" />
    <circle cx="${head.x.toFixed(2)}" cy="${head.y.toFixed(2)}" r="14" fill="#f7f7f8" />
    <circle cx="${head.x.toFixed(2)}" cy="${head.y.toFixed(2)}" r="8" fill="#7be77f" />
  `;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#111112"/>
          <stop offset="55%" stop-color="#090909"/>
          <stop offset="100%" stop-color="#111213"/>
        </linearGradient>
        <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(255,255,255,0.10)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.04)"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(138,255,154,0.65)"/>
          <stop offset="100%" stop-color="rgba(138,255,154,0)"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="180" cy="110" r="160" fill="rgba(255,255,255,0.05)" />
      <circle cx="1120" cy="410" r="190" fill="rgba(120,120,130,0.06)" />
      <rect x="${PANEL_X}" y="${PANEL_Y}" width="${PANEL_WIDTH}" height="${PANEL_HEIGHT}" rx="34" fill="url(#panel)" stroke="rgba(255,255,255,0.10)" />
      <text x="72" y="110" fill="#c6c6cb" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="14" letter-spacing="3">GITHUB SNAKE</text>
      <text x="72" y="175" fill="#f7f7f8" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="52" font-weight="800">
        <tspan x="72" dy="0">Contribution</tspan>
        <tspan x="72" dy="54">Snake</tspan>
      </text>
      <text x="72" y="292" fill="#a4a4ab" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="18" font-weight="600">
        <tspan x="72" dy="0">Recent commits become food.</tspan>
        <tspan x="72" dy="28">The trail eats the graph day by day.</tspan>
      </text>
      <text x="72" y="396" fill="#6f6f76" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="14" font-weight="600">
        ${escapeXml(profile.name || profile.login || USERNAME)}
      </text>
      <text x="72" y="420" fill="#6f6f76" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="14" font-weight="600">
        @${escapeXml(profile.login || USERNAME)}
      </text>
      <text x="72" y="456" fill="#6f6f76" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="12" font-weight="600">
        ${formatNumber(profile.public_repos)} repos · ${formatNumber(profile.followers)} followers · ${formatNumber(getTotalStars(repos))} stars
      </text>
      <rect x="${BOARD_X - 22}" y="${BOARD_Y - 22}" width="${BOARD_WIDTH + 44}" height="${BOARD_HEIGHT + 44}" rx="28" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
      <rect x="${BOARD_X - 12}" y="${BOARD_Y - 12}" width="${BOARD_WIDTH + 24}" height="${BOARD_HEIGHT + 24}" rx="24" fill="rgba(0,0,0,0.14)" />
      ${cells}
      <circle cx="${head.x.toFixed(2)}" cy="${head.y.toFixed(2)}" r="30" fill="url(#glow)" opacity="0.42"/>
      ${body.join("")}
      ${glow}
    </svg>
  `;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en", { notation: value > 9999 ? "compact" : "standard" }).format(value || 0);
}

async function main() {
  const { profile, repos, levels: contributionLevels } = await loadGitHubData().catch(() => ({
    profile: fallbackProfile,
    repos: fallbackRepos,
    levels: [],
  }));

  const levels = buildActivityLevels(contributionLevels, repos);
  const points = buildPathPoints();

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
    await page.setContent(
      `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;background:transparent}#root{width:${WIDTH}px;height:${HEIGHT}px}</style></head><body><div id="root"></div></body></html>`,
      { waitUntil: "load" },
    );

    const frames = [];
    for (let frameIndex = 0; frameIndex < FRAME_COUNT; frameIndex += 1) {
      const svg = renderSvg({ profile, repos, levels, frameIndex, points });
      await page.evaluate((markup) => {
        document.getElementById("root").innerHTML = markup;
      }, svg);
      const buffer = await page.screenshot({ type: "png", omitBackground: false });
      frames.push(PNG.sync.read(buffer).data);
    }

    const gif = GIFEncoder();
    const firstPalette = quantize(frames[0], 256);
    const firstIndexed = applyPalette(frames[0], firstPalette);
    gif.writeFrame(firstIndexed, WIDTH, HEIGHT, {
      palette: firstPalette,
      delay: FRAME_MS,
      repeat: 0,
    });

    for (let index = 1; index < frames.length; index += 1) {
      const palette = quantize(frames[index], 256);
      const indexed = applyPalette(frames[index], palette);
      gif.writeFrame(indexed, WIDTH, HEIGHT, { palette, delay: FRAME_MS });
    }

    gif.finish();
    await fs.writeFile(OUTPUT_PATH, Buffer.from(gif.bytes()));
    console.log(`Generated ${OUTPUT_PATH}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
