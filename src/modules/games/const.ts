export enum GameEmits {
  Error = 'error',
  UpdatedGame = 'updated-game',
  AllGames = 'all-games',
  DeletedGame = 'deleted-game',
  ChangeStatus = 'change-status',
  Started = 'game-started',
  PlayerChooseSituation = 'player-choose-situation',
}

export enum GameMessages {
  CreateNew = 'create-new-game',
  Delete = 'delete-game',
  Update = 'update-game',
  Join = 'join-to-game',
  Leave = 'leave-from-game',
  UpdateAll = 'update-all',
  Status = 'set-status',
  Start = 'start',
  ChooseSituation = 'choose-situation'
}

export enum PlayStatus {
  Pending = 'pending',
  Started = 'started',
  Finished = 'finished',
}
