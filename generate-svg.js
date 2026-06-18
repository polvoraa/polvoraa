const fs = require("node:fs/promises");
const path = require("node:path");
const puppeteer = require("puppeteer");

const root = __dirname;
const outputPath = path.join(root, "profile-dashboard.png");

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

    const node = await page.$("#dashboard");
    if (!node) throw new Error("Dashboard node not found");

    await node.screenshot({
      path: outputPath,
      type: "png",
      omitBackground: false,
    });

    console.log(`Generated ${outputPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
