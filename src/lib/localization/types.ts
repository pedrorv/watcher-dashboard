export interface AppTexts {
  pages: {
    apps: {
      heading: string;
      cardHeading: (appId: string) => string;
      cardNavButton: string;
    };
    signIn: {
      heading: string;
      button: string;
    };
    sessions: {
      heading: string;
      cardHeading: (appId: string) => string;
      cardSubheading: (timestamp: number) => string;
      navRecording: string;
      navHeatmap: string;
    };
    recording: {
      heading: string;
    };
    heatmap: {
      heading: string;
    };
  };

  components: {
    header: {
      recording: string;
      heatmap: string;
    };
  };
}
