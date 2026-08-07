import { readFile, writeFile } from "node:fs/promises";

const versionsUrl = "https://ddragon.leagueoflegends.com/api/versions.json";

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

async function replaceInFile(file, replacer) {
  const before = await readFile(file, "utf8");
  const after = replacer(before);
  if (before !== after) {
    await writeFile(file, after, "utf8");
    return true;
  }
  return false;
}

const versions = await fetchJson(versionsUrl);
const latest = versions[0];

if (!latest) {
  throw new Error("Data Dragon did not return a latest version.");
}

await fetchJson(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/pt_BR/champion.json`);
await fetchJson(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/pt_BR/item.json`);

const changedDdragon = await replaceInFile("lib/ddragon.ts", (content) =>
  content.replace(/export const PATCH = "[^"]+";/, `export const PATCH = "${latest}";`),
);

const changedEnv = await replaceInFile(".env.example", (content) =>
  content.replace(/NEXT_PUBLIC_DDRAGON_VERSION=.*/g, `NEXT_PUBLIC_DDRAGON_VERSION=${latest}`),
);

if (changedDdragon || changedEnv) {
  console.log(`Updated Data Dragon patch to ${latest}`);
} else {
  console.log(`Data Dragon patch already up to date: ${latest}`);
}
