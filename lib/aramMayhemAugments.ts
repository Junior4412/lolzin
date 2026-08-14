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
// 3. Entradas diretas sao campeoes verificados um por um. Para nao deixar o modo vazio nos outros
//    campeoes, a UI usa um fallback declarado por arquetipo: isso nao e apresentado como estatistica
//    real do campeao, e sim como melhor plano por perfil enquanto a coleta direta nao existe.
//
// Fonte: https://www.metasrc.com/lol/mayhem/build/{slug} - "Top augment choices" (All Regions).

import type { ChampionArchetype } from "@/lib/championProfiles";

export type AugmentRarity = "Silver" | "Gold" | "Prismatic";
export type AugmentRecommendationKind = "curated" | "profile";

export type AugmentChoice = {
  name: string;
  reason: string;
};

export type ChampionAugmentPick = {
  championId: string; // precisa bater com o id do Data Dragon (ex: "MissFortune", "Lux")
  patch: string;
  collectedAt: string; // data (YYYY-MM-DD) em que o dado foi coletado do source
  sourceUrl: string;
  kind: AugmentRecommendationKind;
  profileLabel?: string;
  picks: Record<AugmentRarity, AugmentChoice>;
};

export const aramMayhemAugments: ChampionAugmentPick[] = [
  {
    championId: "Lux",
    patch: "26.13",
    collectedAt: "2026-07-11",
    sourceUrl: "https://www.metasrc.com/lol/mayhem/champions/lux/build",
    kind: "curated",
    picks: {
      Silver: { name: "Witchful Thinking", reason: "Amplifica AP cedo e encaixa com poke constante." },
      Gold: { name: "From Downtown", reason: "Valoriza alcance alto e dano antes da luta começar." },
      Prismatic: { name: "Eureka", reason: "Acelera rotacao de habilidades para poke e pickoff." },
    },
  },
  {
    championId: "MissFortune",
    patch: "26.13",
    collectedAt: "2026-07-11",
    sourceUrl: "https://www.metasrc.com/lol/mayhem/build/miss-fortune",
    kind: "curated",
    picks: {
      Silver: { name: "Deft", reason: "Da cadencia para trocar entre Q, ataques e ultimate." },
      Gold: { name: "Critical Rhythm", reason: "Escala com builds criticas e lutas longas." },
      Prismatic: { name: "Fan The Hammer", reason: "Converte dano de atirador em rajadas mais letais." },
    },
  },
  {
    championId: "Jhin",
    patch: "26.13",
    collectedAt: "2026-07-11",
    sourceUrl: "https://www.metasrc.com/lol/mayhem/build/jhin",
    kind: "curated",
    picks: {
      Silver: { name: "Scoped Weapons", reason: "Mais alcance para cutucar antes do quarto tiro." },
      Gold: { name: "Scopier Weapons", reason: "Mantem Jhin seguro enquanto pune alvos parados." },
      Prismatic: { name: "Scopiest Weapons", reason: "Melhor carta prismatica para jogar no alcance maximo." },
    },
  },
  {
    championId: "Caitlyn",
    patch: "26.13",
    collectedAt: "2026-07-11",
    sourceUrl: "https://www.metasrc.com/lol/mayhem/build/caitlyn",
    kind: "curated",
    picks: {
      Silver: { name: "Deft", reason: "Mais ataques para abusar do alcance e dos headshots." },
      Gold: { name: "Critical Rhythm", reason: "Combina com a curva de critico da Caitlyn." },
      Prismatic: { name: "Fan The Hammer", reason: "Aumenta a pressao de DPS em alvos presos." },
    },
  },
  {
    championId: "Ashe",
    patch: "26.13",
    collectedAt: "2026-07-11",
    sourceUrl: "https://www.metasrc.com/lol/mayhem/build/ashe",
    kind: "curated",
    picks: {
      Silver: { name: "Deft", reason: "Mais ataques para aplicar slow e manter DPS." },
      Gold: { name: "Critical Rhythm", reason: "Fortalece lutas longas com build de atirador." },
      Prismatic: { name: "Dual Wield", reason: "Excelente quando Ashe consegue bater livre." },
    },
  },
  {
    championId: "Ezreal",
    patch: "26.13",
    collectedAt: "2026-07-11",
    sourceUrl: "https://www.metasrc.com/lol/mayhem/build/ezreal",
    kind: "curated",
    picks: {
      Silver: { name: "ADAPt", reason: "Aproveita dano misto e itemizacao flexivel." },
      Gold: { name: "From Downtown", reason: "Valoriza Q e poke de longa distancia." },
      Prismatic: { name: "Draw Your Sword", reason: "Melhora o all-in quando Ezreal precisa entrar." },
    },
  }
];

const profileAugments: Record<ChampionArchetype, Omit<ChampionAugmentPick, "championId" | "sourceUrl">> = {
  "adc-crit": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "ADC critico",
    picks: {
      Silver: { name: "Deft", reason: "Mais cadencia para acelerar DPS e aplicar criticos." },
      Gold: { name: "Critical Rhythm", reason: "A melhor linha generica para atiradores criticos." },
      Prismatic: { name: "Fan The Hammer", reason: "Transforma janelas de auto ataque em burst forte." },
    },
  },
  "adc-onhit": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "ADC on-hit",
    picks: {
      Silver: { name: "Deft", reason: "Ataques extras ativam efeitos on-hit com mais frequencia." },
      Gold: { name: "Lightning Strikes", reason: "Fortalece DPS continuo em lutas estendidas." },
      Prismatic: { name: "Dual Wield", reason: "Melhor plano quando o campeao escala batendo sem parar." },
    },
  },
  "adc-caster": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "ADC caster",
    picks: {
      Silver: { name: "Scoped Weapons", reason: "Mais alcance para poke e seguranca." },
      Gold: { name: "From Downtown", reason: "Recompensa habilidades disparadas de longe." },
      Prismatic: { name: "Trueshot Prodigy", reason: "Perfeita para campeoes que vencem no poke." },
    },
  },
  "support-enchanter": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "Encantador",
    picks: {
      Silver: { name: "Sonic Boom", reason: "Aumenta valor de escudos e curas em lutas agrupadas." },
      Gold: { name: "First-Aid Kit", reason: "Fortalece sustain e protecao do time." },
      Prismatic: { name: "Spirit Link", reason: "Excelente para manter o carry vivo em ARAM." },
    },
  },
  "support-tank": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "Suporte tank",
    picks: {
      Silver: { name: "Mountain Soul", reason: "Mais resistencia para iniciar sem explodir." },
      Gold: { name: "Perseverance", reason: "Sustain defensivo em lutas constantes." },
      Prismatic: { name: "Goliath", reason: "Aumenta presença de frontline e engage." },
    },
  },
  "support-mage": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "Suporte mago",
    picks: {
      Silver: { name: "Witchful Thinking", reason: "Mais AP para poke e controle." },
      Gold: { name: "Magic Missile", reason: "Adiciona dano confiavel ao acertar habilidades." },
      Prismatic: { name: "Jeweled Gauntlet", reason: "Alta recompensa para magos de burst." },
    },
  },
  "support-pick": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "Suporte pickoff",
    picks: {
      Silver: { name: "Scoped Weapons", reason: "Mais margem para iniciar pick sem se expor." },
      Gold: { name: "Thread the Needle", reason: "Melhora dano quando o alvo fica preso." },
      Prismatic: { name: "Goliath", reason: "Da corpo para iniciar e sobreviver ao contra-engage." },
    },
  },
  "jungle-assassin": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "Assassino AD",
    picks: {
      Silver: { name: "The Brutalizer", reason: "Letalidade e dano para eliminar alvo fragil." },
      Gold: { name: "Thread the Needle", reason: "Aumenta penetracao em combos de burst." },
      Prismatic: { name: "Draw Your Sword", reason: "Melhor para all-in agressivo em campeoes AD." },
    },
  },
  "jungle-fighter": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "Lutador",
    picks: {
      Silver: { name: "Ocean Soul", reason: "Sustain para brigar varias vezes na mesma luta." },
      Gold: { name: "Thread the Needle", reason: "Mantem dano alto contra alvos com resistencia." },
      Prismatic: { name: "Mystic Punch", reason: "Reduz janelas entre habilidades e ataques." },
    },
  },
  "jungle-tank": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "Tank engage",
    picks: {
      Silver: { name: "Mountain Soul", reason: "Mais resistencia para segurar poke." },
      Gold: { name: "Perseverance", reason: "Recupera vida enquanto voce segura a linha." },
      Prismatic: { name: "Goliath", reason: "Transforma o campeao em frontline principal." },
    },
  },
  "jungle-ap": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "AP jungle",
    picks: {
      Silver: { name: "Witchful Thinking", reason: "Mais AP para burst e limpeza de luta." },
      Gold: { name: "Phenomenal Evil", reason: "Escala forte quando voce acerta varias habilidades." },
      Prismatic: { name: "Jeweled Gauntlet", reason: "Da pico de dano para ultimates e combos." },
    },
  },
  "mid-mage": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "Mago",
    picks: {
      Silver: { name: "Witchful Thinking", reason: "Mais AP desde cedo para poke." },
      Gold: { name: "Magic Missile", reason: "Excelente em campeoes que acertam skillshot repetido." },
      Prismatic: { name: "Jeweled Gauntlet", reason: "Aumenta muito o burst de habilidades." },
    },
  },
  "mid-assassin": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "Assassino",
    picks: {
      Silver: { name: "Contract Killer", reason: "Recompensa escolher e explodir um alvo prioritario." },
      Gold: { name: "Thread the Needle", reason: "Penetracao forte para combos de abate." },
      Prismatic: { name: "Draw Your Sword", reason: "Potencializa entradas agressivas e finalizacoes." },
    },
  },
  "mid-scaling": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "Carry de escala",
    picks: {
      Silver: { name: "ADAPt", reason: "Mantem flexibilidade de dano enquanto escala." },
      Gold: { name: "Phenomenal Evil", reason: "Boa carta para acumular poder em lutas longas." },
      Prismatic: { name: "Eureka", reason: "Mais rotacao de habilidades no late game." },
    },
  },
  "top-fighter": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "Duelista/bruiser",
    picks: {
      Silver: { name: "Ocean Soul", reason: "Sustain para entrar e continuar lutando." },
      Gold: { name: "Thread the Needle", reason: "Dano confiavel contra frontline." },
      Prismatic: { name: "Mystic Punch", reason: "Acelera ciclos de habilidade e ataque." },
    },
  },
  "top-tank": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "Tank",
    picks: {
      Silver: { name: "Mountain Soul", reason: "Melhor base defensiva para aguentar poke." },
      Gold: { name: "Perseverance", reason: "Sustain alto em lutas front-to-back." },
      Prismatic: { name: "Goliath", reason: "Mais vida e presenca para iniciar." },
    },
  },
  "top-ap": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "AP top",
    picks: {
      Silver: { name: "Witchful Thinking", reason: "AP direto para dano constante." },
      Gold: { name: "Phenomenal Evil", reason: "Escala bem em trocas repetidas." },
      Prismatic: { name: "Jeweled Gauntlet", reason: "Aumenta burst em habilidades chave." },
    },
  },
  "top-marksman": {
    patch: "26.13",
    collectedAt: "2026-07-11",
    kind: "profile",
    profileLabel: "Atirador top",
    picks: {
      Silver: { name: "Scoped Weapons", reason: "Alcance para abusar de campeoes melee." },
      Gold: { name: "Critical Rhythm", reason: "Escala com builds de dano fisico." },
      Prismatic: { name: "Scopiest Weapons", reason: "Permite jogar no limite do alcance." },
    },
  },
};

export function getAramMayhemAugments(championId: string, archetype: ChampionArchetype): ChampionAugmentPick {
  const curated = aramMayhemAugments.find((entry) => entry.championId === championId);
  if (curated) return curated;

  return {
    championId,
    sourceUrl: "https://www.metasrc.com/lol/mayhem/build",
    ...profileAugments[archetype],
  };
}
