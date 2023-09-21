import { defineStore } from "pinia";
import TokenPairModel from "../models/TokenPairModel";
import UserModel from "../models/UserModel";

interface AuthStoreState {
  sessionUser: null | UserModel;
  jwtModelState: null | TokenPairModel;
}

export const useAuthStore = defineStore({
  id: "authStore",

  state: (): AuthStoreState => {
    return {
      sessionUser: new UserModel(),
      jwtModelState: null,
    };
  },
});
