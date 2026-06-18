const fs = require("node:fs/promises");
const path = require("node:path");
const puppeteer = require("puppeteer");

const root = __dirname;
const outputPath = path.join(root, "profile-dashboard.svg");

async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
    await page.goto(`file://${path.join(root, "index.html")}`, { waitUntil: "networkidle0" });
    await page.waitForFunction("window.dashboardReady === true", { timeout: 30000 });
    await page.addScriptTag({ path: require.resolve("html-to-image/dist/html-to-image.js") });

    const svg = await page.evaluate(async () => {
      const node = document.getElementById("dashboard");
      return window.htmlToImage.toSvg(node, {
        width: 1600,
        height: 900,
        cacheBust: true,
        pixelRatio: 1,
        backgroundColor: "#0A0A0A",
        style: {
          transform: "none",
          transformOrigin: "top left",
        },
      });
    });

    const normalizedSvg = String(svg).trimStart();
    const match = normalizedSvg.match(/^data:image\/svg\+xml(?:;charset=utf-8)?,(.*)$/s);
    const serializedSvg = match ? decodeURIComponent(match[1]) : normalizedSvg;

    await fs.writeFile(outputPath, serializedSvg, "utf8");
    console.log(`Generated ${outputPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
