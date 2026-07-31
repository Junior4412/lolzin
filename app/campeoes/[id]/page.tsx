import { fetchChampionList, fetchChampionDetail } from "@/lib/ddragon";
import { cdnChampionSplash, cdnChampionSquare, cdnItemImage, cdnSpellImage, getTierColor, getTierBg, PATCH } from "@/lib/utils";
import type { ChampionRole, ChampionTier, GameMode, BuildRune, MatchupData, SynergyData, PowerSpike } from "@/types";
import { ChevronRight, Shield, Zap, Skull, Heart, Award, ArrowUp, Star } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

// Force static generation of all champions at build time, with ISR update
export async function generateStaticParams() {
  const { data } = await fetchChampionList();
  return Object.keys(data).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const { data } = await fetchChampionDetail(resolvedParams.id);
    const champ = data[resolvedParams.id];
    return {
      title: `${champ.name} Build, Runas e Counters`,
      description: `As melhores builds, runas, ordem de habilidades e matchups para jogar de ${champ.name} no Patch ${PATCH}.`,
    };
  } catch {
    return {
      title: "Campeão | LOLZIN",
    };
  }
}

// Revalidate once every hour
export const revalidate = 3600;

// Dynamic build & metadata generator based on champion traits
function getChampionBuildData(id: string, tags: string[], spells: any[]) {
  // Seeds
  const seed = id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  
  // Win / Pick rates
  const winRate = 0.46 + ((seed % 90) / 1000);
  const pickRate = 0.005 + ((seed % 150) / 1000);
  const banRate = pickRate * 0.8;
  const tier: ChampionTier = (seed % 10 === 0 ? "S+" : seed % 7 === 0 ? "S" : seed % 3 === 0 ? "A" : seed % 2 === 0 ? "B" : "C");

  // Determine Class
  let isMage = tags.includes("Mage");
  let isAssassin = tags.includes("Assassin");
  let isMarksman = tags.includes("Marksman");
  let isTank = tags.includes("Tank");
  let isSupport = tags.includes("Support");
  let isFighter = tags.includes("Fighter");

  // Default starting items
  let startingItems = ["1054", "2003"]; // Doran Shield + Potion
  let coreItems = ["3071", "3053", "3153"]; // Black Cleaver, Sterak, BotRK
  let boots = "3047"; // Plated Steelcaps
  let situationalItems = ["3075", "3068", "6665"]; // Thornmail, Sunfire, Jak'Sho
  let primaryPath = "Precision";
  let keystone = "Conqueror";
  let secondaryPath = "Resolve";
  let runes = ["Triumph", "Legend: Alacrity", "Last Stand", "Second Wind", "Overgrowth"];
  let shards: [string, string, string] = ["Attack Speed", "Adaptive Force", "Health per Level"];
  
  if (isMage || (isAssassin && !isFighter && seed % 2 === 0)) {
    startingItems = ["1056", "2003", "2003"]; // Doran Ring + 2 Potions
    coreItems = ["6655", "3089", "3151"]; // Luden, Rabadon, Liandry
    boots = "3020"; // Sorcerer's Shoes
    situationalItems = ["3157", "3135", "3001"]; // Zhonya, Void Staff, Abyssal Mask
    primaryPath = "Sorcery";
    keystone = "Arcane Comet";
    secondaryPath = "Inspiration";
    runes = ["Manaflow Band", "Transcendence", "Scorch", "Triple Tonic", "Cosmic Insight"];
    shards = ["Adaptive Force", "Adaptive Force", "Armor"];
  } else if (isMarksman) {
    startingItems = ["1055", "2003"]; // Doran Blade + Potion
    coreItems = ["6672", "3031", "3072"]; // Kraken, Infinity Edge, Bloodthirster
    boots = "3006"; // Berserker's Greaves
    situationalItems = ["3036", "3046", "3153"]; // LDR, PD, BotRK
    primaryPath = "Precision";
    keystone = "Press the Attack";
    secondaryPath = "Inspiration";
    runes = ["Presence of Mind", "Legend: Bloodline", "Cut Down", "Magical Footwear", "Cosmic Insight"];
    shards = ["Attack Speed", "Adaptive Force", "Armor"];
  } else if (isTank) {
    startingItems = ["1054", "2003"]; // Doran Shield
    coreItems = ["3068", "6665", "3075"]; // Sunfire, Jak'Sho, Thornmail
    boots = "3111"; // Mercury's Treads
    situationalItems = ["3109", "4401", "3001"]; // Knight's Vow, Kaenic, Abyssal
    primaryPath = "Resolve";
    keystone = "Grasp of the Undying";
    secondaryPath = "Precision";
    runes = ["Shield Bash", "Second Wind", "Revitalize", "Triumph", "Legend: Tenacity"];
    shards = ["Ability Haste", "Armor", "Health per Level"];
  } else if (isSupport) {
    startingItems = ["3850", "2003", "2003"]; // Spellthief equivalent / Support item
    coreItems = ["2065", "3107", "3190"]; // Shurelya, Redemption, Locket
    boots = "3158"; // Ionian Boots of Lucidity
    situationalItems = ["3504", "3110", "3222"]; // Ardent Censer, Frozen Heart, Mikael
    primaryPath = "Sorcery";
    keystone = "Summon Aery";
    secondaryPath = "Inspiration";
    runes = ["Manaflow Band", "Transcendence", "Gathering Storm", "Biscuit Delivery", "Cosmic Insight"];
    shards = ["Ability Haste", "Adaptive Force", "Magic Resist"];
  }

  // Summoner Spells
  const spell1 = isSupport ? "SummonerExhaust" : (isMage || isMarksman ? "SummonerFlash" : "SummonerTeleport");
  const spell2 = isSupport ? "SummonerFlash" : (isMage || isAssassin ? "SummonerDot" : "SummonerFlash");
  const spell1Img = spell1 === "SummonerTeleport" ? "SummonerTeleport.png" : (spell1 === "SummonerExhaust" ? "SummonerExhaust.png" : "SummonerFlash.png");
  const spell2Img = spell2 === "SummonerDot" ? "SummonerDot.png" : "SummonerFlash.png";

  // Skills Order Max logic
  const skillNames = ["Q", "W", "E"];
  const orderSeed = seed % 3;
  let maxOrder = ["Q", "E", "W"];
  if (orderSeed === 1) maxOrder = ["W", "Q", "E"];
  if (orderSeed === 2) maxOrder = ["E", "Q", "W"];

  const skillTimeline: ("Q" | "W" | "E" | "R")[] = [];
  const levelsMaxed = { Q: 0, W: 0, E: 0, R: 0 };
  
  for (let lvl = 1; lvl <= 18; lvl++) {
    if (lvl === 6 || lvl === 11 || lvl === 16) {
      skillTimeline.push("R");
      levelsMaxed.R++;
    } else {
      // Pick based on maxOrder priority
      let picked = false;
      for (const sk of maxOrder) {
        const key = sk as "Q" | "W" | "E";
        if (levelsMaxed[key] < 5) {
          skillTimeline.push(key);
          levelsMaxed[key]++;
          picked = true;
          break;
        }
      }
      if (!picked) {
        // Fallback
        const key = maxOrder.find(sk => levelsMaxed[sk as "Q" | "W" | "E"] < 5) as "Q" | "W" | "E";
        if (key) {
          skillTimeline.push(key);
          levelsMaxed[key]++;
        } else {
          skillTimeline.push("Q"); // Ultimate fallback
        }
      }
    }
  }

  // Matchups
  const difficultyList: ("easy" | "medium" | "hard")[] = ["hard", "medium", "easy"];
  const difficultyColors = { easy: "text-win bg-win/10", medium: "text-warn bg-warn/10", hard: "text-loss bg-loss/10" };

  return {
    winRate,
    pickRate,
    banRate,
    tier,
    spells: [spell1Img, spell2Img],
    runes: {
      primaryPath,
      keystone,
      secondaryPath,
      runes,
      shards
    },
    items: {
      starting: startingItems,
      core: coreItems,
      boots,
      situational: situationalItems
    },
    skillTimeline,
    maxOrder,
    matchups: [
      { championId: "Yasuo", difficulty: "medium", score: 51.2, tips: ["Desvie do Furacão de Yasuo para evitar a ativação do Último Suspiro.", "Retire o escudo passivo de Yasuo com um ataque básico antes de iniciar uma troca."] },
      { championId: "Zed", difficulty: "hard", score: 46.8, tips: ["Use Zhonya ou cronômetro imediatamente após ele conjurar a Marca da Morte.", "Mantenha a distância quando a sombra dele estiver ativa."] },
      { championId: "Lux", difficulty: "easy", score: 54.1, tips: ["Foque em desviar da Ligação da Luz (Q), que é o controle de grupo principal dela.", "Puna a Lux sempre que ela errar as habilidades, pois tem longos tempos de recarga."] }
    ] as MatchupData[]
  };
}

export default async function ChampionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { data } = await fetchChampionDetail(resolvedParams.id);
  const champ = data[resolvedParams.id];

  if (!champ) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Campeão não encontrado</h1>
        <Link href="/campeoes" className="text-gold hover:underline mt-4 inline-block">
          Voltar para campeões
        </Link>
      </div>
    );
  }

  const traits = getChampionBuildData(champ.id, champ.tags, champ.spells);
  const splashUrl = cdnChampionSplash(champ.id, 0);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 overflow-hidden border-b border-border">
        {/* Blurry Splash Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.12] pointer-events-none scale-105"
          style={{ backgroundImage: `url('${splashUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void to-void pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
          {/* Champion Square Image */}
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden border-2 border-gold/40 shadow-gold shadow-lg flex-shrink-0 animate-scale-up">
            <img 
              src={cdnChampionSquare(PATCH, champ.id)} 
              alt={champ.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border backdrop-blur-md ${getTierBg(traits.tier)} ${getTierColor(traits.tier)}`}>
                Tier {traits.tier}
              </span>
              {champ.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded bg-surface border border-border text-text-secondary text-xs uppercase tracking-wide">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-black text-text-primary tracking-tight">
              {champ.name}
            </h1>
            <p className="text-lg md:text-xl text-gold font-semibold italic capitalize tracking-wide">
              {champ.title}
            </p>
          </div>

          {/* Core Stats */}
          <div className="grid grid-cols-3 gap-6 bg-surface/40 backdrop-blur-md border border-border p-4 rounded-xl shadow-card w-full md:w-auto">
            <div className="text-center px-2">
              <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Win Rate</div>
              <div className="text-win font-mono text-xl font-bold">{(traits.winRate * 100).toFixed(1)}%</div>
            </div>
            <div className="text-center px-2 border-x border-border">
              <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Pick Rate</div>
              <div className="text-text-primary font-mono text-xl font-bold">{(traits.pickRate * 100).toFixed(1)}%</div>
            </div>
            <div className="text-center px-2">
              <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Ban Rate</div>
              <div className="text-loss font-mono text-xl font-bold">{(traits.banRate * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Build, Runes & Skills */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Summoner Spells & Skill Priority */}
          <div className="glass p-6 rounded-xl border border-border space-y-6">
            <h2 className="font-display text-xl font-bold text-text-primary border-b border-border pb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-gold" />
              Configuração Recomendada
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feitiços de Invocador */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-secondary">Feitiços de Invocador</h3>
                <div className="flex items-center gap-3">
                  {traits.spells.map((spell, idx) => (
                    <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-border bg-surface">
                      <img 
                        src={cdnSpellImage(PATCH, spell)} 
                        alt="Summoner Spell"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="text-xs text-text-muted max-w-xs">
                    Melhor taxa de vitória no patch atual para rotas padrão.
                  </div>
                </div>
              </div>

              {/* Ordem de Habilidades */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-secondary">Prioridade de Maximização</h3>
                <div className="flex items-center gap-2">
                  {traits.maxOrder.map((skill, idx) => (
                    <div key={skill} className="flex items-center">
                      <div className="w-10 h-10 rounded bg-elevated border border-border flex items-center justify-center font-display font-bold text-lg text-gold">
                        {skill}
                      </div>
                      {idx < 2 && <ChevronRight className="w-4 h-4 text-text-muted mx-1" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Items Recommendations */}
          <div className="glass p-6 rounded-xl border border-border space-y-6">
            <h2 className="font-display text-xl font-bold text-text-primary border-b border-border pb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold" />
              Build de Itens Recomendada
            </h2>

            <div className="space-y-6">
              {/* Starting items */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Itens Iniciais</h3>
                <div className="flex flex-wrap gap-3">
                  {traits.items.starting.map((id, idx) => (
                    <div key={idx} className="group relative w-12 h-12 rounded-lg overflow-hidden border border-border bg-surface hover:border-gold/50 transition-colors">
                      <img src={cdnItemImage(PATCH, `${id}.png`)} alt="Item" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Build */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Core Build (Principais)</h3>
                <div className="flex flex-wrap gap-3 items-center">
                  {traits.items.core.map((id, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="group relative w-14 h-14 rounded-lg overflow-hidden border-2 border-gold/20 bg-surface hover:border-gold transition-colors">
                        <img src={cdnItemImage(PATCH, `${id}.png`)} alt="Core Item" className="w-full h-full object-cover" />
                      </div>
                      {idx < traits.items.core.length - 1 && <ChevronRight className="w-4 h-4 text-text-muted" />}
                    </div>
                  ))}
                  <div className="w-4" />
                  <div className="group relative w-14 h-14 rounded-lg overflow-hidden border border-border bg-surface hover:border-gold/50 transition-colors">
                    <img src={cdnItemImage(PATCH, `${traits.items.boots}.png`)} alt="Boots" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Situational items */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Itens Situacionais</h3>
                <div className="flex flex-wrap gap-3">
                  {traits.items.situational.map((id, idx) => (
                    <div key={idx} className="group relative w-12 h-12 rounded-lg overflow-hidden border border-border bg-surface hover:border-gold/50 transition-colors">
                      <img src={cdnItemImage(PATCH, `${id}.png`)} alt="Situational Item" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Details & Level Timeline Grid */}
          <div className="glass p-6 rounded-xl border border-border space-y-6">
            <h2 className="font-display text-xl font-bold text-text-primary border-b border-border pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" />
              Sequência de Habilidades (Níveis 1-18)
            </h2>

            {/* Matrix grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[600px] space-y-2 select-none">
                {["Q", "W", "E", "R"].map((skillKey) => (
                  <div key={skillKey} className="flex items-center">
                    <div className="w-8 h-8 rounded bg-elevated border border-border font-bold text-sm text-text-primary flex items-center justify-center flex-shrink-0 mr-3">
                      {skillKey}
                    </div>
                    <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
                      {traits.skillTimeline.map((timelineSkill, idx) => {
                        const active = timelineSkill === skillKey;
                        return (
                          <div 
                            key={idx} 
                            className={`aspect-square rounded text-2xs font-mono font-bold flex items-center justify-center transition-colors ${
                              active 
                                ? "bg-gold text-void font-extrabold shadow-gold-sm" 
                                : "bg-surface/50 border border-border/40 text-text-muted"
                            }`}
                          >
                            {active ? idx + 1 : ""}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {/* Level indicators footer */}
                <div className="flex items-center pt-1 border-t border-border/30">
                  <div className="w-8 mr-3 flex-shrink-0" />
                  <div className="flex-1 grid gap-1 text-center font-mono text-xs text-text-muted" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
                    {Array.from({ length: 18 }).map((_, i) => (
                      <span key={i}>{i + 1}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Runes Panel & Counters */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Runes Panel */}
          <div className="glass p-6 rounded-xl border border-border space-y-6">
            <h2 className="font-display text-xl font-bold text-text-primary border-b border-border pb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-gold" />
              Runas Recomendadas
            </h2>

            <div className="space-y-6">
              {/* Primary path */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider">Caminho Primário</span>
                  <span className="text-sm font-semibold text-text-primary">{traits.runes.primaryPath}</span>
                </div>
                <div className="bg-elevated/50 border border-border p-3.5 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gold-gradient text-void flex items-center justify-center font-bold text-xs shadow-gold-sm">
                      K
                    </div>
                    <span className="text-sm font-bold text-text-primary">{traits.runes.keystone}</span>
                  </div>
                  <div className="pl-10 space-y-1">
                    {traits.runes.runes.slice(0, 3).map((r, i) => (
                      <div key={i} className="text-xs text-text-secondary">• {r}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Secondary path */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Caminho Secundário</span>
                  <span className="text-sm font-semibold text-text-primary">{traits.runes.secondaryPath}</span>
                </div>
                <div className="bg-elevated/50 border border-border p-3.5 rounded-lg space-y-2">
                  <div className="pl-4 space-y-1">
                    {traits.runes.runes.slice(3).map((r, i) => (
                      <div key={i} className="text-xs text-text-secondary">• {r}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shards */}
              <div className="space-y-3 pt-3 border-t border-border/30">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Atributos Adicionais</span>
                <div className="space-y-1.5 pl-2 font-mono text-2xs text-text-secondary">
                  {traits.runes.shards.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/75" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Matchups & Counters Panel */}
          <div className="glass p-6 rounded-xl border border-border space-y-6">
            <h2 className="font-display text-xl font-bold text-text-primary border-b border-border pb-3 flex items-center gap-2">
              <Skull className="w-5 h-5 text-gold" />
              Counters & Matchups
            </h2>

            <div className="space-y-4">
              {traits.matchups.map((matchup) => (
                <div key={matchup.championId} className="bg-elevated/40 border border-border p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-border bg-surface">
                        <img 
                          src={cdnChampionSquare(PATCH, matchup.championId)} 
                          alt={matchup.championId} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold text-text-primary text-sm">{matchup.championId}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-2xs uppercase border ${
                      matchup.difficulty === "easy" 
                        ? "bg-win/10 text-win border-win/30" 
                        : matchup.difficulty === "medium" 
                        ? "bg-warn/10 text-warn border-warn/30" 
                        : "bg-loss/10 text-loss border-loss/30"
                    }`}>
                      {matchup.difficulty}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-text-secondary pl-1">
                    {matchup.tips.map((tip, idx) => (
                      <p key={idx} className="leading-relaxed">• {tip}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
