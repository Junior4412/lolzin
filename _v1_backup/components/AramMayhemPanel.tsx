// components/AramMayhemPanel.tsx
"use client";

import { AlertTriangle, Sparkles } from "lucide-react";
import { Champion } from "@/lib/builds";
import { getAramMayhemAugments } from "@/lib/aramMayhemAugments";

const rarityColor: Record<string, string> = {
  Silver: "#c7ccd6",
  Gold: "#d9a441",
  Prismatic: "#8fd7ff"
};

export default function AramMayhemPanel({ selected }: { selected: Champion }) {
  const entry = getAramMayhemAugments(selected.id);

  return (
    <section className="skillPanel cardGlass" aria-label="Aprimoramentos do ARAM: Desordem">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">ARAM: Desordem</span>
          <h4>Melhores Aprimoramentos para {selected.name}</h4>
        </div>
        <Sparkles size={18} />
      </div>

      {entry ? (
        <>
          <div className="abilityGrid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {(["Silver", "Gold", "Prismatic"] as const).map((rarity) => (
              <article className="abilityCard cardGlass" key={rarity}>
                <strong style={{ color: rarityColor[rarity], background: "transparent" }}>{rarity[0]}</strong>
                <div>
                  <h5>{entry.picks[rarity]}</h5>
                  <p>Raridade {rarity}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="matchupNote">
            Fonte: METAsrc (patch {entry.patch}, coletado em {entry.collectedAt}, filtro &quot;All Regions&quot;).
            Importante: a Riot nao expoe dado de partida do ARAM: Mayhem via API oficial - isso e uma
            combinacao de dados de ARAM normal e de Aprimoramento do modo Arena, a melhor aproximacao
            real disponivel publicamente, nao uma estatistica pura do modo. Pode mudar bastante de patch
            pra patch. <a href={entry.sourceUrl} target="_blank" rel="noreferrer">Ver fonte original</a>.
          </p>
        </>
      ) : (
        <div className="emptyState">
          <AlertTriangle size={22} />
          <h3>Ainda sem dado curado para {selected.name}</h3>
          <p>
            Ainda nao coletamos dado real de Aprimoramento do ARAM: Desordem para esse campeao. Preferimos
            deixar isso em branco a inventar uma recomendacao - assim que for coletado de uma fonte real,
            aparece aqui.
          </p>
        </div>
      )}
    </section>
  );
}
