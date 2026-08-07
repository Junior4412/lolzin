const sources = [
  "https://ddragon.leagueoflegends.com/api/versions.json",
  "https://static.developer.riotgames.com/docs/lol/gameModes.json",
  "https://www.leagueoflegends.com/pt-br/news/game-updates/",
  "https://op.gg/pt/lol/champions",
  "https://blitz.gg/lol/champions",
];

for (const url of sources) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "LOLZIN daily updater (+https://github.com/Junior4412/lolzin)",
    },
  });

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  console.log(`ok ${response.status} ${url}`);
}
