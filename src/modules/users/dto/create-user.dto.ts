export class CreateUserDto {
  email: string;
  password: string;
  nickname?: string;
  refreshToken?: string;
  avatar?: string;
}
