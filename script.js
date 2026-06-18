const USERNAME = "polvoraa";

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
  {
    name: "nova-interface-lab",
    description: "A refined front-end playground for product interfaces, motion studies and AI-assisted components.",
    language: "TypeScript",
    stargazers_count: 42,
    updated_at: "2026-03-18T00:00:00Z",
  },
  {
    name: "portfolio-system",
    description: "Personal design system built for clean portfolio experiences.",
    language: "React",
    stargazers_count: 31,
    updated_at: "2026-02-10T00:00:00Z",
  },
  {
    name: "analytics-studio",
    description: "Minimal dashboards and Power BI experiments for creative teams.",
    language: "JavaScript",
    stargazers_count: 26,
    updated_at: "2026-01-20T00:00:00Z",
  },
];

const techStack = [
  ["JavaScript", "M12 3v18M5 8h14M7 16c1.4 1.6 3.1 2.3 5 2.3 2.4 0 4-1.1 4-2.8 0-1.5-.8-2.3-2.8-3.1l-2.4-.9c-1.6-.6-2.5-1.5-2.5-2.9 0-1.8 1.6-3.1 3.8-3.1 1.7 0 3 .5 4.2 1.5"],
  ["TypeScript", "M4 5h16v14H4zM8 9h8M12 9v7M16 15c.8.7 1.7 1 2.7 1 1.2 0 2.3-.5 2.3-1.5 0-.9-.7-1.2-2.2-1.6-1.6-.4-2.6-1-2.6-2.3 0-1.4 1.2-2.4 3-2.4.9 0 1.8.2 2.5.7"],
  ["React", "M12 12m-2.1 0a2.1 2.1 0 1 0 4.2 0a2.1 2.1 0 1 0-4.2 0M12 4.5c4.8 0 8.7 3.4 8.7 7.5s-3.9 7.5-8.7 7.5S3.3 16.1 3.3 12 7.2 4.5 12 4.5ZM5.6 8.2c2.4-4.2 7.4-5.9 11.1-3.8 3.7 2.1 4.8 7.2 2.4 11.4-2.4 4.2-7.4 5.9-11.1 3.8-3.7-2.1-4.8-7.2-2.4-11.4ZM18.4 8.2c2.4 4.2 1.3 9.3-2.4 11.4-3.7 2.1-8.7.4-11.1-3.8C2.5 11.6 3.6 6.5 7.3 4.4c3.7-2.1 8.7-.4 11.1 3.8Z"],
  ["Node.js", "M12 3.5 19.4 8v8L12 20.5 4.6 16V8L12 3.5ZM8.5 10.2v4.2L12 16.5l3.5-2.1v-4.2"],
  ["MongoDB", "M12 21s5-4.1 5-10.4C17 6.2 14.3 3.4 12 2c-2.3 1.4-5 4.2-5 8.6C7 16.9 12 21 12 21ZM12 21v-8"],
  ["HTML", "M5 3h14l-1.3 15L12 21l-5.7-3L5 3ZM8.8 7h6.4M9.2 11h5.9l-.4 3.6-2.7 1.4-2.7-1.4-.2-1.7"],
  ["CSS", "M5 3h14l-1.3 15L12 21l-5.7-3L5 3ZM9 7h6.4l-.3 3H9.4l.3 3h5.1l-.3 1.8L12 16l-2.4-1.2"],
  ["Power BI", "M5 19V9M10 19V5M15 19v-7M20 19V8M4 19h17"],
];

const $ = (id) => document.getElementById(id);

function formatNumber(value) {
  return new Intl.NumberFormat("en", { notation: value > 9999 ? "compact" : "standard" }).format(value || 0);
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
  return response.json();
}

async function loadGitHubData() {
  if (!USERNAME || USERNAME === "SEU_USUARIO") {
    return { profile: fallbackProfile, repos: fallbackRepos, events: [] };
  }

  const [profile, repos, events] = await Promise.all([
    fetchJson(`https://api.github.com/users/${USERNAME}`),
    fetchJson(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`),
    fetchJson(`https://api.github.com/users/${USERNAME}/events/public?per_page=100`),
  ]);

  return { profile, repos, events };
}

function renderProfile(profile) {
  $("avatar").src = profile.avatar_url || fallbackProfile.avatar_url;
  $("name").textContent = profile.name || profile.login || fallbackProfile.name;
  $("title").textContent = profile.company ? `Creative Developer & ${profile.company.replace(/^@/, "")}` : fallbackProfile.company;
  $("bio").textContent = profile.bio || fallbackProfile.bio;
  $("usernameLabel").textContent = `@${profile.login || USERNAME}`;
  $("locationLabel").textContent = profile.location || "Remote Studio";
  $("reposCount").textContent = formatNumber(profile.public_repos);
  $("followersCount").textContent = formatNumber(profile.followers);
  $("followingCount").textContent = formatNumber(profile.following);
}

function getTotalStars(repos) {
  return repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
}

function getCommitEstimate(events, repos) {
  const pushedCommits = events
    .filter((event) => event.type === "PushEvent")
    .reduce((sum, event) => sum + (event.payload?.commits?.length || 0), 0);
  return pushedCommits || Math.max(0, Math.round(repos.length * 18 + getTotalStars(repos) * 1.7));
}

function renderStats(repos, events) {
  $("starsCount").textContent = formatNumber(getTotalStars(repos));
  $("commitsCount").textContent = formatNumber(getCommitEstimate(events, repos));
}

function renderHeatmap(events, repos) {
  const heatmap = $("heatmap");
  heatmap.innerHTML = "";
  const activityByDay = new Map();

  events.forEach((event) => {
    const key = new Date(event.created_at).toISOString().slice(0, 10);
    activityByDay.set(key, (activityByDay.get(key) || 0) + 1);
  });

  for (let index = 0; index < 104; index += 1) {
    const day = new Date();
    day.setDate(day.getDate() - (103 - index));
    const key = day.toISOString().slice(0, 10);
    const eventLevel = activityByDay.get(key) || 0;
    const repoSignal = repos[index % Math.max(repos.length, 1)]?.stargazers_count || 0;
    const fallbackLevel = ((index * 7 + repoSignal) % 5) / 4;
    const level = events.length ? Math.min(eventLevel / 4, 1) : fallbackLevel;
    const cell = document.createElement("span");
    cell.className = "heat-cell";
    cell.style.setProperty("--level", level.toFixed(2));
    const palette = [
      ["rgba(255, 255, 255, 0.035)", "rgba(255, 255, 255, 0.05)"],
      ["rgba(161, 218, 163, 0.22)", "rgba(161, 218, 163, 0.3)"],
      ["rgba(76, 175, 93, 0.34)", "rgba(76, 175, 93, 0.46)"],
      ["rgba(42, 153, 66, 0.48)", "rgba(42, 153, 66, 0.62)"],
      ["rgba(35, 122, 53, 0.66)", "rgba(35, 122, 53, 0.8)"],
    ];
    const levelIndex = Math.min(4, Math.max(0, Math.round(level * 4)));
    const [fill, border] = palette[levelIndex];
    cell.style.background = `linear-gradient(180deg, ${fill}, ${border})`;
    cell.style.borderColor = border;
    heatmap.appendChild(cell);
  }
}

function renderProjects(repos) {
  const sorted = [...repos]
    .filter((repo) => !repo.fork)
    .sort((a, b) => {
      const scoreA = (a.stargazers_count || 0) * 3 + (a.forks_count || 0) + Date.parse(a.updated_at || 0) / 1e12;
      const scoreB = (b.stargazers_count || 0) * 3 + (b.forks_count || 0) + Date.parse(b.updated_at || 0) / 1e12;
      return scoreB - scoreA;
    })
    .slice(0, 3);

  $("projectsGrid").innerHTML = sorted
    .map(
      (repo) => `
        <article class="project-card">
          <strong>${repo.name}</strong>
          <p>${repo.description || "A focused repository shaped around clean implementation and practical product detail."}</p>
          <div class="project-meta">
            <span>${repo.language || "Code"}</span>
            <span>${formatNumber(repo.stargazers_count || 0)} stars</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderTechStack() {
  $("techGrid").innerHTML = techStack
    .map(
      ([label, path]) => `
        <div class="tech-item" title="${label}" aria-label="${label}">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path d="${path}"></path>
          </svg>
        </div>
      `,
    )
    .join("");
}

async function init() {
  document.body.classList.add("is-loading");
  renderTechStack();

  try {
    const { profile, repos, events } = await loadGitHubData();
    const repoList = repos.length ? repos : fallbackRepos;
    renderProfile(profile);
    renderStats(repoList, events);
    renderHeatmap(events, repoList);
    renderProjects(repoList);
  } catch (error) {
    console.warn(error);
    renderProfile(fallbackProfile);
    renderStats(fallbackRepos, []);
    renderHeatmap([], fallbackRepos);
    renderProjects(fallbackRepos);
  } finally {
    document.body.classList.remove("is-loading");
    window.dashboardReady = true;
  }
}

init();
