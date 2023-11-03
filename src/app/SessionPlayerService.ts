import { playSessionOperationsFactory } from "@/factories/playSessionOperationsFactory";
import { first, last } from "@/lib/array";
import { SessionPlayerState } from "@/types";

const MILLIS_TO_HIDE_MOUSE_EVENTS = 1000;

export class SessionPlayerService {
  private originalEvents: any[];

  constructor(
    private sessionPlayerState: SessionPlayerState,
    private events: any[],
    private setters: {
      setCurTimestamp: (curTimestamp: number) => void;
      setPlayerDimensions: (playerDimensions: {
        width: number;
        height: number;
      }) => void;
      setPlayerScroll: (playerScroll: {
        scrollX: number;
        scrollY: number;
      }) => void;
    }
  ) {
    this.originalEvents = events;
    this.events = SessionPlayerService.fillGapsWithEmptyEvents(events);
  }

  static filterSessionEvents(events: any[]) {
    return events.filter((e) =>
      [
        "keydown",
        "mousemove",
        "click",
        "dom-change",
        "scroll",
        "resize",
      ].includes(e.name)
    );
  }

  private static fillGapsWithEmptyEvents(events: any[]) {
    const eventsAndEmptyEvents: any[] = [];

    let currIdx = 0;
    for (let nextIdx = 1; nextIdx <= events.length - 1; nextIdx++) {
      eventsAndEmptyEvents.push(events[currIdx]);

      const currTimestamp = events[currIdx].timestamp;
      const nextTimestamp = events[nextIdx].timestamp;
      const emptyEventsToAddCount = Math.max(
        0,
        nextTimestamp - currTimestamp - 1
      );

      for (let i = 1; i <= emptyEventsToAddCount; i++) {
        eventsAndEmptyEvents.push({
          type: "empty",
          name: "empty",
          timestamp: currTimestamp + i,
        });
      }

      currIdx = nextIdx;
    }
    eventsAndEmptyEvents.push(events[currIdx]);

    return eventsAndEmptyEvents;
  }

  private get keydownEvents(): any[] {
    return this.originalEvents.filter((e) => e.name === "keydown");
  }

  private get mouseEvents(): any[] {
    return this.originalEvents.filter((e) => e.type === "mouse");
  }

  private get uiEvents(): any[] {
    return this.originalEvents.filter((e) => e.type === "ui");
  }

  private setCurrentTimestamp(timestamp: number) {
    this.setters.setCurTimestamp(timestamp);
    this.sessionPlayerState.curTimestamp = timestamp;
  }

  private setPlayerDimensions = (dimensions: {
    width: number;
    height: number;
  }) => {
    this.setters.setPlayerDimensions(dimensions);
  };

  private setPlayerScroll(newScroll: { scrollX: number; scrollY: number }) {
    this.setters.setPlayerScroll(newScroll);
    this.sessionPlayerState.playerScroll = newScroll;
  }

  private eventsToHide() {
    const { hideMouseEvent } = playSessionOperationsFactory(
      this.sessionPlayerState
    );

    const playStartTimestamp = this.sessionPlayerState.curTimestamp;

    const eventsToHide = this.originalEvents.filter(
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
  }

  private eventsToDisplay() {
    const {
      displayKeydownEvent,
      displayMouseEvent,
      displayUIEvent,
      hideMouseEvent,
    } = playSessionOperationsFactory(this.sessionPlayerState);

    const playStartTimestamp = this.sessionPlayerState.curTimestamp;

    const eventsToDisplay = this.events.filter(
      (e) => e.timestamp >= playStartTimestamp
    );

    eventsToDisplay.forEach((event) => {
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
          this.setPlayerDimensions({
            width: event.properties.innerWidth,
            height: event.properties.innerHeight,
          });
        } else if (event.name === "scroll") {
          this.setPlayerScroll({
            scrollX: event.properties.scrollX,
            scrollY: event.properties.scrollY,
          });
        } else if (event.name === "resize") {
          this.setPlayerDimensions({
            width: event.properties.innerWidth,
            height: event.properties.innerHeight,
          });
        }
      }, timestamp - playStartTimestamp);

      this.sessionPlayerState.timers.push(timer);
    });
  }

  private clearTimeouts() {
    this.sessionPlayerState.timers.forEach(clearTimeout);
    this.sessionPlayerState.timers = [];
  }

  private hideAllMouseEvents() {
    document
      .querySelectorAll(".mouse-event")
      .forEach((element) => element.classList.remove("visible"));
  }

  set(timestamp: number) {
    const {
      displayUIEvent,
      displayMouseEvent,
      displayKeydownEvent,
      replaceAllBreaks,
    } = playSessionOperationsFactory(this.sessionPlayerState);

    const uiEventToRender = last(
      this.uiEvents.filter((e) => e.timestamp <= timestamp)
    );
    const scrollEventToRender = last(
      this.events.filter((e) => e.name === "scroll" && e.timestamp <= timestamp)
    );

    if (!uiEventToRender) return;

    const mouseEventsToRender = this.mouseEvents.filter(
      (e) =>
        e.timestamp > timestamp - MILLIS_TO_HIDE_MOUSE_EVENTS &&
        e.timestamp <= timestamp
    );
    const keydownEventsToRender = this.keydownEvents.filter(
      (e) =>
        e.timestamp >= uiEventToRender.timestamp && e.timestamp <= timestamp
    );

    this.clearTimeouts();
    this.setCurrentTimestamp(timestamp);
    displayUIEvent(uiEventToRender);
    replaceAllBreaks();
    this.hideAllMouseEvents();

    this.setPlayerScroll({
      scrollX: scrollEventToRender?.properties?.scrollX ?? 0,
      scrollY: scrollEventToRender?.properties?.scrollY ?? 0,
    });

    if (this.sessionPlayerState.isPlaying()) {
      this.play();
    } else {
      mouseEventsToRender.forEach((event) => displayMouseEvent(event));
      keydownEventsToRender.forEach((event) => displayKeydownEvent(event));
    }
  }

  play() {
    const { replaceAllBreaks } = playSessionOperationsFactory(
      this.sessionPlayerState
    );
    replaceAllBreaks();

    const isRestart =
      this.sessionPlayerState.curTimestamp === last(this.events).timestamp;

    if (isRestart) {
      this.setCurrentTimestamp(first(this.events).timestamp);
      this.setPlayerScroll({ scrollX: 0, scrollY: 0 });
    }

    this.eventsToDisplay();
    this.eventsToHide();
  }

  pause() {
    this.clearTimeouts();
  }

  stop() {
    const { hideMouseEvent, displayUIEvent } = playSessionOperationsFactory(
      this.sessionPlayerState
    );

    this.pause();
    this.mouseEvents.forEach(hideMouseEvent);
    const uiEvent = first(this.uiEvents);
    displayUIEvent(uiEvent);
    this.setPlayerDimensions({
      width: uiEvent.properties.innerWidth,
      height: uiEvent.properties.innerHeight,
    });
    this.setCurrentTimestamp(this.events[0].timestamp);
    this.setPlayerScroll({ scrollX: 0, scrollY: 0 });
  }
}
