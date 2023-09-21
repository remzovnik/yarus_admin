import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class TokenPairModel extends BaseViewModel {
  accessToken: string | null;
  accessTokenExp: number;
  refreshToken: string | null;
  refreshTokenExp: number;

  public constructor(init?: Partial<TokenPairModel>) {
    super();
    Object.assign(this, init);
  }
}
