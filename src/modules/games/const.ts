export enum GameEmits {
  Error = 'error',
  UpdatedGame = 'updated-game',
  AllGames = 'all-games',
  DeletedGame = 'deleted-game',
  ChangeStatus = 'change-status',
  Started = 'game-started',
  PlayerChooseSituation = 'player-choose-situation',
  GameFrame = 'game-frame',
}

export enum GameMessages {
  CreateNew = 'create',
  Delete = 'delete-game',
  Update = 'update-game',
  Join = 'join',
  Leave = 'leave-from-game',
  UpdateAll = 'update-all',
  Status = 'set-status',
  Start = 'start',
  ChooseSituation = 'choose-situation',
  ReadyPlayRound = 'ready-play-round'
}

export enum PlayStatus {
  Pending = 'pending',
  Started = 'started',
  Finished = 'finished',
}
