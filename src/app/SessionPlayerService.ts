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

  private get keydownEvents(): any[] {
    return this.events.filter(
      (e) => e.type === "keyboard" && e.name === "keydown"
    );
  }

  private get mouseEvents(): any[] {
    return this.events.filter((e) => e.type === "mouse");
  }

  private get uiEvents(): any[] {
    return this.events.filter((e) => e.type === "ui");
  }

  play(): void {
    const initialTimestamp = this.events[0].timestamp;
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
              clearAllInputs(this.keydownEvents);
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

  stop(): void {
    const { clearAllInputs, hideMouseEvent, displayUIEvent } =
      playSessionOperationsFactory(this.sessionPlayerState);

    this.pause();
    clearAllInputs(this.keydownEvents);
    this.mouseEvents.forEach(hideMouseEvent);
    displayUIEvent(this.uiEvents[0]);
    this.setCurTimestamp(this.events[0].timestamp);
  }
}
