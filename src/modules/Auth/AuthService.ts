import UserModel from "./models/UserModel";
import { AuthResult, AuthStatusType } from "./models/AuthResult";
import LoginData from "./models/LoginData";
import TokenPairModel from "./models/TokenPairModel";
import { RegistrationResult } from "./models/RegistrationResult";
import { BaseService } from "@/_core/service/BaseService";
import { useCookies } from "@vueuse/integrations/useCookies";
import { useAuthStore } from "./stores/AuthStore";

export default class AuthService extends BaseService {
  ACCESS_TOKEN_COOKIE_NAME = "yr_a_t";
  REFRESH_TOKEN_COOKIE_NAME = "yr_r_t";
  AUTH_API_HEADERS = { "X-API-KEY": "4G59MA1wwii96SAfzAFFLDJB5uBmsI" };

  tokenCookies = useCookies([this.ACCESS_TOKEN_COOKIE_NAME, this.REFRESH_TOKEN_COOKIE_NAME]);
  authStore = useAuthStore();

  get isAuthenticated() {
    return !!this.authStore.sessionUser?.id;
  }

  get accessToken() {
    return this.authStore.jwtModelState?.accessToken;
  }

  get accessTokenExpired() {
    if (!!this.authStore.jwtModelState?.accessTokenExp) {
      return (this.authStore.jwtModelState?.accessTokenExp || 0 * 1000) - Date.now() > 0;
    }
    return false;
  }

  get refreshToken() {
    return this.authStore.jwtModelState?.refreshToken;
  }

  get refreshTokenExpired() {
    if (!!this.authStore?.jwtModelState?.refreshTokenExp) {
      return this.authStore.jwtModelState.refreshTokenExp * 1000 - Date.now() > 0;
    }
    return false;
  }

  get currentUser() {
    return this.authStore.sessionUser;
  }

  async tryRestoreUser() {
    this.resoreTokenStateFromCookie();
    try {
      const user = await this.getMe();
      this.authStore.sessionUser = user;
      // eslint-disable-next-line no-empty
    } catch {}
  }

  async login(loginData: LoginData, checkPhoneExists = true) {
    try {
      const isPhoneExists = !checkPhoneExists || (await this.isPhoneExists(loginData.phone));
      if (isPhoneExists) {
        const config: any = {};
        config.headers = this.AUTH_API_HEADERS;

        const formData = new FormData();
        formData.append("phone", loginData.phone);
        formData.append("password", loginData.password);

        const resp = await this.apiRequest.post("https://auth.yarus.ru/auth", formData, config);
        this.saveTokensFromResponse(resp);

        const user = await this.getMe();
        this.authStore.sessionUser = user;

        return AuthResult.createOK();
      } else {
        return new AuthResult(AuthStatusType.PhoneNotExists, "Телефон не найден");
      }
    } catch (error: any) {
      this.authStore.sessionUser = null;
      this.clearTokens();
      return AuthResult.createError(error);
    }
  }

  async logout() {
    try {
      const config: any = {};
      config.headers = this.AUTH_API_HEADERS;

      await this.apiRequest.post("https://auth.yarus.ru/logout", {}, config);
    } catch (error: any) {
      return AuthResult.createError(error);
    } finally {
      this.authStore.sessionUser = null;
      this.clearTokens();
    }
  }

  async recoveryPassword(phone: string) {
    try {
      const formData = new FormData();
      formData.append("phone", phone);
      await this.apiRequest.post("user/recover/password", formData);
      return true;
    } catch {
      return false;
    }
  }

  checkRecoveryCode(phone: string, code: string) {
    return this.checkRecoveryOrRegistrationCode(phone, code, "user/recover/check-code");
  }

  async register(phone: string) {
    try {
      const formData = new FormData();
      formData.append("phone", phone);
      await this.apiRequest.post("reg", formData);
      return RegistrationResult.createOK();
    } catch (err: any) {
      if (err.response?.status === 409) {
        return RegistrationResult.createUserAlreadyExists(err.response?.data?.body);
      }
      return RegistrationResult.createError(err);
    }
  }

  checkRegistrationCode(phone: string, code: string) {
    return this.checkRecoveryOrRegistrationCode(phone, code, "reg/code");
  }

  async sendRefreshToken() {
    const config: any = {};
    config.headers = this.AUTH_API_HEADERS;
    try {
      await this.apiRequest.post("https://auth.yarus.ru/refresh", {}, config);
      return true;
    } catch {
      return false;
    }
  }

  private async checkRecoveryOrRegistrationCode(phone: string, code: string, routeName: string) {
    try {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("code", code);

      const result = await this.apiRequest.post(routeName, formData);
      this.saveTokensFromResponse(result);

      const user = await this.getMe();
      this.authStore.sessionUser = user;

      return true;
    } catch {
      return false;
    }
  }

  private getMe() {
    return this.getOneOrFail(UserModel, "user");
  }

  private async isPhoneExists(phone: string) {
    const result = await this.getAnyOrNull("user/exist", { params: { phone } });
    return !!result?.status;
  }

  private saveTokensFromResponse(response) {
    if (!!response?.data) {
      const model = new TokenPairModel({ ...response?.data });
      this.tokenCookies.set(this.ACCESS_TOKEN_COOKIE_NAME, model.accessToken, {
        expires: new Date(model.accessTokenExp * 1000),
      });
      this.tokenCookies.set(this.REFRESH_TOKEN_COOKIE_NAME, model.refreshToken, {
        expires: new Date(model.refreshTokenExp * 1000),
      });

      this.authStore.jwtModelState = model;
    }
  }

  private resoreTokenStateFromCookie() {
    const model = new TokenPairModel();
    model.accessToken = this.tokenCookies.get(this.ACCESS_TOKEN_COOKIE_NAME) || null;
    model.refreshToken = this.tokenCookies.get(this.REFRESH_TOKEN_COOKIE_NAME) || null;
    this.authStore.jwtModelState = model;
  }

  private clearTokens() {
    this.tokenCookies.remove(this.ACCESS_TOKEN_COOKIE_NAME);
    this.tokenCookies.remove(this.REFRESH_TOKEN_COOKIE_NAME);

    this.authStore.jwtModelState = null;
  }
}
