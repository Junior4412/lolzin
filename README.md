# DraftForge - LoL Build MVP

MVP de SaaS inspirado em ferramentas como Blitz e OP.GG: o usuario busca qualquer campeao, escolhe o modo de jogo e recebe uma build com itens, runas, feiticos, power spikes e plano de jogo.

## Stack

- Next.js + React + TypeScript
- CSS puro responsivo
- Campeoes e itens oficiais via Riot Data Dragon CDN
- Recomendador meta-like por classe, mapa e modo de jogo
- Pronto para deploy na Vercel

## Rodar local

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Deploy GitHub + Vercel

1. Crie um repositorio no GitHub.
2. Rode:

```bash
git init
git add .
git commit -m "feat: create lol build mvp"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

3. Na Vercel, clique em "Add New Project", importe o repositorio e publique.
4. Opcional: configure `NEXT_PUBLIC_DDRAGON_VERSION` para a versao desejada do Data Dragon. O default atual e `16.13.1`.

## Proximos passos de produto

- Integrar fonte estatistica por modo, elo, lane e regiao.
- Trocar o recomendador heuristico por win rate, pick rate e sample size reais.
- Adicionar autenticacao e favoritos de builds.
- Salvar preferencias do usuario.
- Criar painel admin para curadoria manual das builds.
