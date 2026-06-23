const fs = require("node:fs/promises");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const puppeteer = require("puppeteer");
const { PNG } = require("pngjs");
const { GIFEncoder, quantize, applyPalette } = require("gifenc");

const USERNAME = "polvoraa";
const WIDTH = 1280;
const HEIGHT = 540;
const OUTPUT_PATH = path.join(__dirname, "profile-snake.gif");

const BOARD_COLS = 8;
const BOARD_ROWS = 13;
const CELL = 26;
const GAP = 7;
const BOARD_WIDTH = BOARD_COLS * CELL + (BOARD_COLS - 1) * GAP;
const BOARD_HEIGHT = BOARD_ROWS * CELL + (BOARD_ROWS - 1) * GAP;
const FRAME_MS = 90;
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
    return {
      profile: fallbackProfile,
      repos: fallbackRepos,
      contributionDays: new Map(),
      repoCommits: [],
    };
  }

  const [profile, repos, contributionsHtml] = await Promise.all([
    fetchJson(`https://api.github.com/users/${USERNAME}`),
    fetchJson(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`),
    fetchText(`https://github.com/users/${USERNAME}/contributions`),
  ]);

  return {
    profile,
    repos,
    contributionDays: parseContributionDays(contributionsHtml),
    repoCommits: loadRepoCommits(),
  };
}

function getTotalStars(repos) {
  return repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
}

function parseContributionDays(html) {
  const days = new Map();
  const regex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    days.set(match[1], Number(match[2]));
  }

  return days;
}

function loadRepoCommits() {
  try {
    const output = execFileSync("git", ["log", "--since=365 days ago", "--pretty=format:%ad|%H", "--date=short"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    if (!output) {
      return [];
    }

    return output
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const [date, sha] = line.split("|");
        return { date, sha };
      });
  } catch {
    return [];
  }
}

function buildDateKeys(daysCount) {
  const keys = [];
  const today = new Date();

  for (let offset = daysCount - 1; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    keys.push(day.toISOString().slice(0, 10));
  }

  return keys;
}

function buildActivityCells(contributionDays, repoCommits, repos) {
  const expected = BOARD_COLS * BOARD_ROWS;
  const dates = buildDateKeys(expected);
  const repoCommitDays = repoCommits.reduce((days, commit) => {
    days.set(commit.date, (days.get(commit.date) || 0) + 1);
    return days;
  }, new Map());

  return dates.map((date, index) => {
    const repoSignal = repos[index % Math.max(repos.length, 1)]?.stargazers_count || 0;
    const contributionLevel = contributionDays.get(date) || 0;
    const repoCommits = repoCommitDays.get(date) || 0;
    const repoLevel = Math.min(4, Math.ceil(repoCommits / 3));
    const actualLevel = repoLevel;
    const fallbackLevel = (index * 7 + repoSignal) % 5;

    return {
      date,
      index,
      actualLevel,
      displayLevel: actualLevel > 0 ? Math.max(actualLevel, contributionLevel) : fallbackLevel,
      commits: repoCommits,
    };
  });
}

function cellCoords(index) {
  const row = Math.floor(index / BOARD_COLS);
  const col = row % 2 === 0 ? index % BOARD_COLS : BOARD_COLS - 1 - (index % BOARD_COLS);
  return { row, col };
}

function coordsToIndex(row, col) {
  return row * BOARD_COLS + (row % 2 === 0 ? col : BOARD_COLS - 1 - col);
}

function buildOrthogonalPath(startIndex, targetIndex) {
  const path = [startIndex];
  let { row, col } = cellCoords(startIndex);
  const target = cellCoords(targetIndex);

  const stepRow = () => {
    while (row !== target.row) {
      row += row < target.row ? 1 : -1;
      path.push(coordsToIndex(row, col));
    }
  };

  const stepCol = () => {
    while (col !== target.col) {
      col += col < target.col ? 1 : -1;
      path.push(coordsToIndex(row, col));
    }
  };

  if (Math.abs(target.col - col) >= Math.abs(target.row - row)) {
    stepCol();
    stepRow();
  } else {
    stepRow();
    stepCol();
  }

  return path;
}

function buildSweepOrder() {
  const indices = [];
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    const cols = row % 2 === 0 ? [...Array(BOARD_COLS).keys()] : [...Array(BOARD_COLS).keys()].reverse();
    cols.forEach((col) => {
      indices.push(coordsToIndex(row, col));
    });
  }
  return indices;
}

function buildSnakeRoute(cells) {
  const targets = cells
    .filter((cell) => cell.actualLevel > 0)
    .sort((a, b) => b.commits - a.commits || b.actualLevel - a.actualLevel || a.date.localeCompare(b.date) || a.index - b.index);

  const orderedTargets = targets.length
    ? targets
    : [...cells].sort((a, b) => b.displayLevel - a.displayLevel || a.date.localeCompare(b.date) || a.index - b.index);

  const routeIndices = [coordsToIndex(0, 0)];
  let currentIndex = routeIndices[0];
  const visited = new Set(routeIndices);

  orderedTargets.forEach((target) => {
    const segment = buildOrthogonalPath(currentIndex, target.index);
    segment.slice(1).forEach((index) => {
      routeIndices.push(index);
      visited.add(index);
    });
    currentIndex = target.index;
  });

  const sweepOrder = buildSweepOrder();
  sweepOrder.forEach((index) => {
    if (visited.has(index)) {
      return;
    }
    const segment = buildOrthogonalPath(currentIndex, index);
    segment.slice(1).forEach((step) => {
      routeIndices.push(step);
      visited.add(step);
    });
    currentIndex = index;
  });

  return {
    stepCells: routeIndices,
    foodIndices: new Set(targets.map((cell) => cell.index)),
    targets: orderedTargets,
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

function renderSvg({ profile, repos, cells, frameIndex, route }) {
  const routeLength = route.stepCells.length;
  const routeStep = Math.min(frameIndex, routeLength - 1);
  const visitedIndices = new Set(route.stepCells.slice(0, routeStep + 1));
  const snakeLength = Math.min(routeStep + 1, Math.max(10, Math.min(24, 10 + Math.floor(routeStep / 7))));
  const snakeTrail = route.stepCells.slice(Math.max(0, routeStep - snakeLength + 1), routeStep + 1);
  const snakeTrailIndex = new Map(snakeTrail.map((index, age) => [index, age]));
  const headIndex = snakeTrail[snakeTrail.length - 1] ?? route.stepCells[0];
  const headRect = cellRect(headIndex);
  const headCx = headRect.x + CELL / 2;
  const headCy = headRect.y + CELL / 2;

  const boardCells = cells
    .map((level, index) => {
      const rect = cellRect(level.index);
      const visited = visitedIndices.has(level.index);
      const trailAge = snakeTrailIndex.get(level.index);
      const onSnake = typeof trailAge === "number";
      const trailPosition = onSnake && snakeTrail.length > 1 ? trailAge / (snakeTrail.length - 1) : 1;
      const palette = paletteLevels[level.displayLevel];
      const dotRadius = 4 + level.displayLevel * 0.55 + (route.foodIndices.has(level.index) && !visited ? 1.2 : 0);
      const cx = rect.x + CELL / 2;
      const cy = rect.y + CELL / 2;
      const baseOpacity = level.actualLevel > 0 ? 1 : 0.55;
      const dotOpacity = visited ? 0 : baseOpacity;
      const fillOpacity = visited ? 0.12 : 1;
      const targetGlow = level.actualLevel > 0 && !visited ? "0.28" : "0.10";
      const snakeFill = trailAge === snakeTrail.length - 1
        ? "rgba(247,247,248,0.98)"
        : `rgba(123,231,127,${Math.min(0.72, 0.14 + trailPosition * 0.58).toFixed(2)})`;
      const snakeStroke = trailAge === snakeTrail.length - 1
        ? "rgba(255,255,255,0.22)"
        : `rgba(103,255,141,${Math.min(0.36, 0.10 + trailPosition * 0.2).toFixed(2)})`;

      return `
        <rect x="${rect.x}" y="${rect.y}" width="${CELL}" height="${CELL}" rx="7" fill="${visited ? "rgba(17,18,22,0.94)" : palette.fill}" stroke="${visited ? "rgba(255,255,255,0.02)" : palette.border}" />
        <circle cx="${cx}" cy="${cy}" r="${dotRadius}" fill="${palette.dot}" opacity="${dotOpacity}" style="filter: drop-shadow(0 0 6px rgba(120,255,140,${targetGlow}));" />
        <rect x="${rect.x + 1}" y="${rect.y + 1}" width="${CELL - 2}" height="${CELL - 2}" rx="6" fill="none" stroke="rgba(255,255,255,${(0.03 * fillOpacity).toFixed(2)})" />
        ${onSnake ? `<rect x="${rect.x + 2}" y="${rect.y + 2}" width="${CELL - 4}" height="${CELL - 4}" rx="6" fill="${snakeFill}" stroke="${snakeStroke}" style="filter: drop-shadow(0 0 8px rgba(126,255,145,${trailAge === snakeTrail.length - 1 ? "0.34" : "0.14"}));" />` : ""}
      `;
    })
    .join("");

  const glow = `
    <circle cx="${headCx.toFixed(2)}" cy="${headCy.toFixed(2)}" r="22" fill="rgba(111,255,145,0.12)" />
    <circle cx="${headCx.toFixed(2)}" cy="${headCy.toFixed(2)}" r="11" fill="#f7f7f8" stroke="rgba(126,255,145,0.35)" stroke-width="1.5" />
    <circle cx="${headCx - 3.5}" cy="${headCy - 1}" r="1.4" fill="#111112" />
    <circle cx="${headCx + 3.5}" cy="${headCy - 1}" r="1.4" fill="#111112" />
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
        <tspan x="72" dy="0">Largest commits become food.</tspan>
        <tspan x="72" dy="28">Every square the snake crosses gets eaten.</tspan>
      </text>
      <text x="72" y="396" fill="#6f6f76" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="14" font-weight="600">
        ${escapeXml(profile.name || profile.login || USERNAME)}
      </text>
      <text x="72" y="420" fill="#6f6f76" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="14" font-weight="600">
        @${escapeXml(profile.login || USERNAME)}
      </text>
      <text x="72" y="456" fill="#6f6f76" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="12" font-weight="600">
        ${formatNumber(profile.public_repos)} repos | ${formatNumber(profile.followers)} followers | ${formatNumber(getTotalStars(repos))} stars
      </text>
      <rect x="${BOARD_X - 22}" y="${BOARD_Y - 22}" width="${BOARD_WIDTH + 44}" height="${BOARD_HEIGHT + 44}" rx="28" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
      <rect x="${BOARD_X - 12}" y="${BOARD_Y - 12}" width="${BOARD_WIDTH + 24}" height="${BOARD_HEIGHT + 24}" rx="24" fill="rgba(0,0,0,0.14)" />
      ${boardCells}
      <circle cx="${headCx.toFixed(2)}" cy="${headCy.toFixed(2)}" r="30" fill="url(#glow)" opacity="0.42"/>
      ${glow}
    </svg>
  `;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en", { notation: value > 9999 ? "compact" : "standard" }).format(value || 0);
}

async function main() {
  const { profile, repos, contributionDays, repoCommits } = await loadGitHubData().catch(() => ({
    profile: fallbackProfile,
    repos: fallbackRepos,
    contributionDays: new Map(),
    repoCommits: [],
  }));

  const cells = buildActivityCells(contributionDays, repoCommits, repos);
  const route = buildSnakeRoute(cells);
  const frameCount = Math.max(route.stepCells.length + 12, 1);

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
    for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
      const svg = renderSvg({ profile, repos, cells, frameIndex, route });
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
      repeat: -1,
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
