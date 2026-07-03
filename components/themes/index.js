import * as DefaultTheme from "./default";
import * as LuxuryTheme from "./luxury";
import * as premiumTheme from "./premium";

const themes = {
  default: DefaultTheme,
  luxury: LuxuryTheme,
  premium: premiumTheme,

};

export function getTheme(themeName = "default") {
  return themes[themeName] || themes.default;
}