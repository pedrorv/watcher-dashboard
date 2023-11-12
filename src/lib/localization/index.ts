import ptBR from "./pt-BR";
import enUS from "./en-US";
import { AppTexts } from "./types";

const locales = { "pt-BR": ptBR, "en-US": enUS };
const locale = (navigator && navigator.language) ?? "en-US";

export const getTexts = (): AppTexts =>
  locales[locale as keyof typeof locales] ?? locales["en-US"];
