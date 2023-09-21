import { BaseViewModel } from "@/_core/models/BaseViewModel";
import { required } from "@vuelidate/validators";

export default class LoginData {
  public constructor(init?: Partial<LoginData>) {
    Object.assign(this, init);
  }

  public phone = "";
  public password = "";
  public rememberMe = true;
}

export const validationsRule = () => {
  return {
    phone: { required },
    password: { required },
  };
};
