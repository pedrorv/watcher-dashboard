import { playSessionOperationsFactory } from "@/factories/playSessionOperationsFactory";
import { SessionPlayerState } from "@/types";

const MILLIS_TO_HIDE_MOUSE_EVENTS = 1000;
const MILLIS_TO_RESTART = 2000;

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

  private setCurrentTimestamp(timestamp: number) {
    this.setCurTimestamp(timestamp);
    this.sessionPlayerState.curTimestamp = timestamp;
  }

  play(): void {
    const playStartTimestamp = this.sessionPlayerState.curTimestamp;
    const {
      displayKeydownEvent,
      displayMouseEvent,
      displayUIEvent,
      hideMouseEvent,
      clearAllInputs,
    } = playSessionOperationsFactory(this.sessionPlayerState);

    const eventsToDisplay = this.events.filter(
      (e) => e.timestamp >= playStartTimestamp
    );
    const eventsToHide = this.events.filter(
      (e) =>
        e.timestamp >= playStartTimestamp - MILLIS_TO_HIDE_MOUSE_EVENTS &&
        e.timestamp <= playStartTimestamp &&
        e.type === "mouse"
    );

    const hideStartTimestamp = eventsToHide[0]?.timestamp;
    eventsToHide.forEach((event) => {
      const { timestamp } = event;

      const timer = setTimeout(() => {
        this.sessionPlayerState.timers.push(
          setTimeout(
            () => hideMouseEvent(event),
            timestamp - playStartTimestamp + MILLIS_TO_HIDE_MOUSE_EVENTS
          )
        );
      }, timestamp - hideStartTimestamp);

      this.sessionPlayerState.timers.push(timer);
    });

    eventsToDisplay.forEach((event, index, arr) => {
      const { timestamp } = event;

      const timer = setTimeout(() => {
        this.setCurrentTimestamp(timestamp);

        if (event.name === "keydown") {
          displayKeydownEvent(event);
        } else if (event.type === "mouse") {
          displayMouseEvent(event);
          this.sessionPlayerState.timers.push(
            setTimeout(() => hideMouseEvent(event), MILLIS_TO_HIDE_MOUSE_EVENTS)
          );
        } else if (event.type === "ui") {
          displayUIEvent(event);
        }

        if (index === arr.length - 1) {
          this.sessionPlayerState.timers.push(
            setTimeout(() => {
              clearAllInputs(this.keydownEvents);
            }, MILLIS_TO_RESTART)
          );
        }
      }, timestamp - playStartTimestamp);

      this.sessionPlayerState.timers.push(timer);
    });
  }

  pause(): void {
    this.sessionPlayerState.timers.forEach(clearTimeout);
    this.sessionPlayerState.timers = [];
  }

  stop(): void {
    const { clearAllInputs, hideMouseEvent, displayUIEvent } =
      playSessionOperationsFactory(this.sessionPlayerState);

    this.pause();
    clearAllInputs(this.keydownEvents);
    this.mouseEvents.forEach(hideMouseEvent);
    displayUIEvent(this.uiEvents[0]);
    this.setCurrentTimestamp(this.events[0].timestamp);
  }
}
