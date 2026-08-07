const GAME_MODES_URL = "https://static.developer.riotgames.com/docs/lol/gameModes.json";

export type RiotGameMode = {
  gameMode: string;
  description: string;
};

export async function fetchGameModes(): Promise<RiotGameMode[]> {
  const response = await fetch(GAME_MODES_URL, {
    next: {
      revalidate: 24 * 60 * 60,
      tags: ["riot-game-modes"],
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Riot game modes: ${response.status}`);
  }

  return response.json() as Promise<RiotGameMode[]>;
}
