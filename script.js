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
  {
    label: "JavaScript",
    viewBox: "0 0 24 24",
    path: "M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z",
    fill: "#f7df1e",
  },
  {
    label: "TypeScript",
    viewBox: "0 0 24 24",
    path: "M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z",
    fill: "#3178c6",
  },
  {
    label: "React",
    viewBox: "0 0 24 24",
    path: "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z",
    fill: "#61dafb",
  },
  {
    label: "Node.js",
    viewBox: "0 0 24 24",
    path: "M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z",
    fill: "#5fa04e",
  },
  {
    label: "MongoDB",
    viewBox: "0 0 24 24",
    path: "M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z",
    fill: "#47a248",
  },
  {
    label: "HTML",
    viewBox: "0 0 24 24",
    path: "M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z",
    fill: "#e34f26",
  },
  {
    label: "CSS",
    viewBox: "0 0 24 24",
    path: "M0 0v20.16A3.84 3.84 0 0 0 3.84 24h16.32A3.84 3.84 0 0 0 24 20.16V3.84A3.84 3.84 0 0 0 20.16 0Zm14.256 13.08c1.56 0 2.28 1.08 2.304 2.64h-1.608c.024-.288-.048-.6-.144-.84-.096-.192-.288-.264-.552-.264-.456 0-.696.264-.696.84-.024.576.288.888.768 1.08.72.288 1.608.744 1.92 1.296q.432.648.432 1.656c0 1.608-.912 2.592-2.496 2.592-1.656 0-2.4-1.032-2.424-2.688h1.68c0 .792.264 1.176.792 1.176.264 0 .456-.072.552-.24.192-.312.24-1.176-.048-1.512-.312-.408-.912-.6-1.32-.816q-.828-.396-1.224-.936c-.24-.36-.36-.888-.36-1.536 0-1.44.936-2.472 2.424-2.448m5.4 0c1.584 0 2.304 1.08 2.328 2.64h-1.608c0-.288-.048-.6-.168-.84-.096-.192-.264-.264-.528-.264-.48 0-.72.264-.72.84s.288.888.792 1.08c.696.288 1.608.744 1.92 1.296.264.432.408.984.408 1.656.024 1.608-.888 2.592-2.472 2.592-1.68 0-2.424-1.056-2.448-2.688h1.68c0 .744.264 1.176.792 1.176.264 0 .456-.072.552-.24.216-.312.264-1.176-.048-1.512-.288-.408-.888-.6-1.32-.816-.552-.264-.96-.576-1.2-.936s-.36-.888-.36-1.536c-.024-1.44.912-2.472 2.4-2.448m-11.031.018c.711-.006 1.419.198 1.839.63.432.432.672 1.128.648 1.992H9.336c.024-.456-.096-.792-.432-.96-.312-.144-.768-.048-.888.24-.12.264-.192.576-.168.864v3.504c0 .744.264 1.128.768 1.128a.65.65 0 0 0 .552-.264c.168-.24.192-.552.168-.84h1.776c.096 1.632-.984 2.712-2.568 2.688-1.536 0-2.496-.864-2.472-2.472v-4.032c0-.816.24-1.44.696-1.848.432-.408 1.146-.624 1.857-.63",
    fill: "#663399",
  },
  {
    label: "Power BI",
    viewBox: "0 0 512 512",
    path: "M32 32c17.7 0 32 14.3 32 32l0 336c0 8.8 7.2 16 16 16l400 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L80 480c-44.2 0-80-35.8-80-80L0 64C0 46.3 14.3 32 32 32zM144 224c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32zm144-64l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32s32 14.3 32 32zm80 32c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM512 96l0 224c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-224c0-17.7 14.3-32 32-32s32 14.3 32 32z",
    fill: "#f2c811",
  },
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
      ({ label, viewBox, path, fill }) => `
        <div class="tech-item" title="${label}" aria-label="${label}">
          <svg viewBox="${viewBox}" role="img" aria-hidden="true" style="color: ${fill};">
            <path d="${path}" fill="currentColor"></path>
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
