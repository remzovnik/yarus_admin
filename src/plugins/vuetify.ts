import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { ru } from "vuetify/locale";

export default createVuetify({
  locale: {
    defaultLocale: "ru",
    messages: { ru },
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#3972e0",
          secondary: "#1f2023",
          mainColor: "#4A9DF7",
          success: "#4caf50",
          warning: "#ef5350",
          info: "#ff9800",
          bgColor: "#f5f6f8",
        },
      },
    },
  },
});
