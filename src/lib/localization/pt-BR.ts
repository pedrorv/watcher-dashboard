import { AppTexts } from "./types";

const texts: AppTexts = {
  pages: {
    apps: {
      heading: "Apps",
      cardHeading: (appId: string) => `App ${appId}`,
      cardNavButton: "Sessões",
    },
    signIn: {
      heading: "Digite o token de autorização",
      button: "Autenticar",
    },
    sessions: {
      heading: "Sessões",
      cardHeading: (sessionId: string) => `Sessão ${sessionId}`,
      cardSubheading: (timestamp: number) =>
        `em ${new Date(timestamp).toLocaleString("pt-BR")}`,
      navRecording: "Gravação",
      navHeatmap: "Mapa de calor",
    },
    recording: {
      heading: "Gravação da sessão",
    },
    heatmap: {
      heading: "Mapa de calor da sessão",
    },
  },

  components: {
    header: {
      recording: "Gravação",
      heatmap: "Mapa de calor",
    },
  },
};

export default texts;
