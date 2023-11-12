import { AppTexts } from "./types";

const texts: AppTexts = {
  pages: {
    apps: {
      heading: "Apps",
      cardHeading: (appId: string) => `App ${appId}`,
      cardNavButton: "Sessions",
    },
    signIn: {
      heading: "Enter the auth token",
      button: "Authenticate",
    },
    sessions: {
      heading: "Sessions",
      cardHeading: (sessionId: string) => `Session ${sessionId}`,
      cardSubheading: (timestamp: number) =>
        `at ${new Date(timestamp).toLocaleString("en-US")}`,
      navRecording: "Recording",
      navHeatmap: "Heatmap",
    },
    recording: {
      heading: "Session recording",
    },
    heatmap: {
      heading: "Session heatmap",
    },
  },

  components: {
    header: {
      recording: "Recording",
      heatmap: "Heatmap",
    },
  },
};

export default texts;
