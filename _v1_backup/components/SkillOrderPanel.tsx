// components/SkillOrderPanel.tsx
"use client";

import { Build, Champion, ChampionAbilityDetails } from "@/lib/builds";

interface SkillOrderPanelProps {
  abilityDetails: ChampionAbilityDetails | null;
  build: Build;
  selected: Champion;
}

export default function SkillOrderPanel({ abilityDetails, build, selected }: SkillOrderPanelProps) {
  return (
    <section className="skillPanel cardGlass">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">Ordem de habilidades</span>
          <h4>O que upar em cada nivel - {selected.name}</h4>
        </div>
      </div>

      <div className="skillSequence" aria-label="Sequencia de upgrade de 1 a 15">
        {build.skillOrder.map((key, index) => (
          <span className={key === "R" ? "ultimateSkill" : ""} key={`${key}-${index}`}>
            {key}
            <small>{index + 1}</small>
          </span>
        ))}
      </div>

      <div className="abilityGrid">
        {abilityDetails ? (
          <>
            <AbilityCard ability={abilityDetails.passive} />
            {abilityDetails.abilities.map((ability) => (
              <AbilityCard ability={ability} key={ability.key} />
            ))}
          </>
        ) : (
          <>
            <AbilitySkeleton label="Passiva" />
            <AbilitySkeleton label="Q" />
            <AbilitySkeleton label="W" />
            <AbilitySkeleton label="E" />
            <AbilitySkeleton label="R" />
          </>
        )}
      </div>
    </section>
  );
}

function AbilityCard({ ability }: { ability: ChampionAbilityDetails["passive"] }) {
  return (
    <article className="abilityCard cardGlass">
      <strong>{ability.key}</strong>
      <div>
        <h5>{ability.name}</h5>
        <p>{ability.description}</p>
      </div>
    </article>
  );
}

function AbilitySkeleton({ label }: { label: string }) {
  return (
    <article className="abilityCard cardGlass">
      <strong>?</strong>
      <div>
        <h5>{label}</h5>
        <p>Carregando detalhes oficiais do Data Dragon.</p>
      </div>
    </article>
  );
}
