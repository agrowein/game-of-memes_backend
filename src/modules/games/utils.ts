import { User } from "../users/entities/user.entity";

export  const checkReady = (ready: any) => {
  return !ready.some((record) => record.ready === false);
};

export const generateStack = (players: User[], count: number) => {
  let repeatedArray = players.slice();
  for (let i = 1; i < count; i++) {
    repeatedArray = repeatedArray.concat(players);
  }
  return repeatedArray.map((player) => player.id);
};