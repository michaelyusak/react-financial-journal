import type { IToken } from "./Token";

export interface ILoginRes {
  access_token: IToken;
  refresh_token: IToken
}
