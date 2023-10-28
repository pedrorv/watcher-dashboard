import { playSessionOperationsFactory } from "@/factories/playSessionOperationsFactory";
import { SessionPlayerState } from "@/types";

export class SessionPlayerService {
  constructor(
    private sessionPlayerState: SessionPlayerState,
    private events: any[],
    private setCurTimestamp: (curTimestamp: number) => void
  ) {}

  static filterSessionEvents(events: any[]) {
    return events.filter((e) =>
      ["keydown", "mousemove", "click", "dom-change"].includes(e.name)
    );
  }

  play(): void {
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
    } = playSessionOperationsFactory(this.sessionPlayerState);

    this.events.forEach((event, index, arr) => {
      const { timestamp } = event;

      const timer = setTimeout(() => {
        this.setCurTimestamp(timestamp);
        this.sessionPlayerState.curTimestamp = timestamp;

        if (event.name === "keydown") {
          displayKeydownEvent(event);
        } else if (event.type === "mouse") {
          displayMouseEvent(event);
          this.sessionPlayerState.timers.push(
            setTimeout(() => hideMouseEvent(event), 1000)
          );
        } else if (event.type === "ui") {
          displayUIEvent(event);
        }

        if (index === arr.length - 1) {
          this.sessionPlayerState.timers.push(
            setTimeout(() => {
              clearAllInputs(keydownEvents);
            }, 2000)
          );
        }
      }, timestamp - initialTimestamp);

      this.sessionPlayerState.timers.push(timer);
    });
  }

  pause(): void {
    this.sessionPlayerState.timers.forEach(clearTimeout);
    this.sessionPlayerState.timers.splice(
      0,
      this.sessionPlayerState.timers.length
    );
  }
}
