export interface IToken {
  token: string;
  expired_at: number;
}

export interface IValidatedAccount {
  email: string;
  name: string;
  roles: string[];
}
