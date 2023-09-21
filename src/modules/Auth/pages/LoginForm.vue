<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import LoginData, { validationsRule } from "../models/LoginData";
import useVuelidate from "@vuelidate/core";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import AuthService from "../AuthService";
import { useRouter } from "vue-router";
import BaseInput from "@/components/forms/BaseInput.vue";
import { phoneMask } from "@/_core/utils/InputMaskDefinitions";

const router = useRouter();
const loginData = reactive(new LoginData());

const v$ = useVuelidate(validationsRule(), loginData);

const login = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  }
  await ServiceLocator.instance.getService(AuthService).login(loginData);
  router.push({ name: "bloggers-feed", params: { userId: 0 } });
};
</script>

<template>
  <v-row class="h-full" align="center" justify="center">
    <v-col>
      <v-card elevation="4" class="mx-auto" max-width="500">
        <section class="p-[40px]">
          <v-img max-width="100" class="mb-5 mx-auto" src="/images/logo.svg" />

          <div class="mt-[42px]">
            <base-input
              v-model="loginData.phone"
              :mask="phoneMask"
              placeholder="Введите телефон"
              :has-error="v$.phone.$error"
              @blur="v$.phone.$touch()"
            ></base-input>

            <base-input
              v-model="loginData.password"
              class="mt-[32px]"
              type="password"
              placeholder="Введите пароль"
              :has-error="v$.password.$error"
              @blur="v$.password.$touch()"
            ></base-input>
            <v-btn block class="mr-4 mt-[40px] bg-blue-500 text-white" @click="login()"> Войти </v-btn>
          </div>
        </section>
      </v-card>
    </v-col>
  </v-row>
</template>
