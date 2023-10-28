import { playSessionOperationsFactory } from "@/factories/playSessionOperationsFactory";
import { PlaySessionState } from "@/types";

export class PlaySession {
  constructor(
    private playSessionState: PlaySessionState,
    private events: any[],
    private setCurTimestamp: (curTimestamp: number) => void
  ) {}

  execute(): void {
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
    } = playSessionOperationsFactory(this.playSessionState);

    this.events.forEach((event, index, arr) => {
      const { timestamp } = event;

      setTimeout(() => {
        this.setCurTimestamp(timestamp);

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
