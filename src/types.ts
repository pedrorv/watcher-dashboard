type Timer = ReturnType<typeof setTimeout>;

export type SessionPlayerState = {
  activeIframe: HTMLIFrameElement;
  timers: Timer[];
  curTimestamp: number;
  playerScroll: {
    scrollX: number;
    scrollY: number;
  };
};
