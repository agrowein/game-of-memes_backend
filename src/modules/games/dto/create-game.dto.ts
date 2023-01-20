export class CreateGameDto {
  name: string;
  password?: string;
  playersCount: 2 | 3 | 4 | 5;
}
