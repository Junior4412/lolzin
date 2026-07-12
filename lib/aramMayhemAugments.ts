// lib/aramMayhemAugments.ts
//
// Recomendacao de Aprimoramentos (cartas) do modo ARAM: Desordem por campeao.
//
// IMPORTANTE - leia antes de mexer aqui:
// 1. A Riot NAO expoe dado de partida do ARAM: Mayhem via API oficial. O proprio METAsrc avisa
//    isso: o que existe e uma combinacao de dados do ARAM normal + dados de Aprimoramento do
//    modo Arena, nao uma medicao direta de partidas de Mayhem. Ou seja, mesmo isso sendo o
//    melhor dado real disponivel publicamente, NAO e "estatistica pura do modo".
// 2. Isso muda de patch pra patch (as vezes de forma grande). Cada entrada abaixo tem o patch e
//    a data da coleta. Se o patch atual do jogo for muito mais novo que o registrado aqui,
//    considere os dados desatualizados e recolete antes de confiar neles.
// 3. So existem entradas pra campeoes que foram REALMENTE coletados (verificados um por um via
//    metasrc.com, filtro "All Regions", patch 26.13, julho de 2026). NUNCA adicione um campeao
//    aqui "estimando" ou "adivinhando" a partir do arquetipo/classe dele - isso e exatamente o
//    tipo de dado fabricado que este projeto ja teve que remover antes (ver historico do
//    app/api/player/route.ts). Se o campeao nao foi coletado, ele simplesmente nao aparece aqui,
//    e a UI deve mostrar um estado honesto de "sem dado curado ainda".
//
// Fonte: https://www.metasrc.com/lol/mayhem/build/{slug} - "Top augment choices" (All Regions).

export type AugmentRarity = "Silver" | "Gold" | "Prismatic";

export type ChampionAugmentPick = {
  championId: string; // precisa bater com o id do Data Dragon (ex: "MissFortune", "Lux")
  patch: string;
  collectedAt: string; // data (YYYY-MM-DD) em que o dado foi coletado do source
  sourceUrl: string;
  picks: Record<AugmentRarity, string>;
};

export const aramMayhemAugments: ChampionAugmentPick[] = [
  {
    championId: "Lux",
    patch: "26.13",
    collectedAt: "2026-07-11",
    sourceUrl: "https://www.metasrc.com/lol/mayhem/champions/lux/build",
    picks: { Silver: "Witchful Thinking", Gold: "From Downtown", Prismatic: "Eureka" }
  },
  {
    championId: "MissFortune",
    patch: "26.13",
    collectedAt: "2026-07-11",
    sourceUrl: "https://www.metasrc.com/lol/mayhem/build/miss-fortune",
    picks: { Silver: "Deft", Gold: "Critical Rhythm", Prismatic: "Fan The Hammer" }
  },
  {
    championId: "Jhin",
    patch: "26.13",
    collectedAt: "2026-07-11",
    sourceUrl: "https://www.metasrc.com/lol/mayhem/build/jhin",
    picks: { Silver: "Scoped Weapons", Gold: "Scopier Weapons", Prismatic: "Fan The Hammer" }
  },
  {
    championId: "Caitlyn",
    patch: "26.13",
    collectedAt: "2026-07-11",
    sourceUrl: "https://www.metasrc.com/lol/mayhem/build/caitlyn",
    picks: { Silver: "Deft", Gold: "Critical Rhythm", Prismatic: "Fan The Hammer" }
  },
  {
    championId: "Ashe",
    patch: "26.13",
    collectedAt: "2026-07-11",
    sourceUrl: "https://www.metasrc.com/lol/mayhem/build/ashe",
    picks: { Silver: "Deft", Gold: "Critical Rhythm", Prismatic: "Dual Wield" }
  },
  {
    championId: "Ezreal",
    patch: "26.13",
    collectedAt: "2026-07-11",
    sourceUrl: "https://www.metasrc.com/lol/mayhem/build/ezreal",
    picks: { Silver: "ADAPt", Gold: "From Downtown", Prismatic: "Draw Your Sword" }
  }
];

export function getAramMayhemAugments(championId: string): ChampionAugmentPick | null {
  return aramMayhemAugments.find((entry) => entry.championId === championId) ?? null;
}
