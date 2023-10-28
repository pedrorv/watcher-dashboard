import { playSessionOperationsFactory } from "@/factories/playSessionOperationsFactory";

export class PlaySession {
  constructor(private events: any[]) {}

  execute(): void {
    const activeIframe = document.querySelector(
      "session-frame.visible"
    ) as HTMLIFrameElement;
    const playSessionState = { activeIframe };
    const initialTimestamp = this.events[0].timestamp;
    const keydownEvents = this.events.filter(
      (e) => e.type === "keyboard" && e.name === "keydown"
    );
    const {
      displayKeydownEvent,
      displayMouseEvent,
      displayUIEvent,
      hideMouseEvent,
      clearAllInputs,
    } = playSessionOperationsFactory(playSessionState);

    this.events.forEach((event, index, arr) => {
      const { timestamp } = event;

      setTimeout(() => {
        if (event.name === "keydown") {
          displayKeydownEvent(event);
        } else if (event.type === "mouse") {
          displayMouseEvent(event);
          setTimeout(() => hideMouseEvent(event), 1000);
        } else if (event.type === "ui") {
          displayUIEvent(event);
        }

        if (index === arr.length - 1) {
          setTimeout(() => {
            clearAllInputs(keydownEvents);
          }, 2000);
        }
      }, timestamp - initialTimestamp);
    });
  }
}
