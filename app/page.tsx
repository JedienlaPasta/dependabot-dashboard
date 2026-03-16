import DashboardClient from "./ui/DashboardClient";

const OWNER = "JedienlaPasta";
const REPOS = [
  "sensor",
  "dom-consultas-legacy",
  "dom-consultas-legacy-client",
  "accion-mascota",
  "docs-algarrobo",
];

async function getAlerts() {
  const token = process.env.GITHUB_API_TOKEN;
  if (!token) throw new Error("Falta el GITHUB_API_TOKEN en .env.local");

  const fetchPromises = REPOS.map(async (repo) => {
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${repo}/dependabot/alerts?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: 300 },
      },
    );

    if (!res.ok) {
      console.error(`Error fetching ${repo}:`, res.status);
      return [];
    }

    const data = await res.json();
    return data.map((alert: any) => ({ ...alert, repository: repo }));
  });

  const allAlerts = await Promise.all(fetchPromises);

  return allAlerts
    .flat()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
}

export default async function Dashboard() {
  const alerts = await getAlerts();

  return <DashboardClient initialAlerts={alerts} repos={REPOS} />;
}
