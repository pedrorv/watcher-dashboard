import { createMemo, createEffect } from "solid-js";
import SessionFrames from "../components/SessionFrames";
import MouseEvents from "../components/MouseEvents";

import "./SessionPlayer.scss";

function SessionPlayer({ events }: { events: any[] }) {
  const uiEvents = createMemo(() => events.filter((e) => e.type === "ui"));
  const mousemoveEvents = createMemo(() =>
    events.filter((e) => e.type === "mouse" && e.name === "mousemove")
  );
  const clickEvents = createMemo(() =>
    events.filter((e) => e.type === "mouse" && e.name === "click")
  );
  const keydownEvents = createMemo(() =>
    events.filter((e) => e.type === "keyboard" && e.name === "keydown")
  );

  createEffect(() => {
    const initialTimestamp = events[0].timestamp;
    const sessionFrame = document.getElementById(
      "session-frame"
    ) as HTMLIFrameElement;
    if (!sessionFrame) return;

    const updateInputValue = (
      iframe: HTMLIFrameElement,
      selector: string,
      cb: (val: string) => string
    ) => {
      const possibleInput =
        iframe?.contentWindow?.document?.querySelector?.(selector);

      if (possibleInput && possibleInput.getAttribute("value") != undefined) {
        (possibleInput as any).value = cb((possibleInput as any).value);
      }
    };

    const typeOnInputs = (keyboardEvents: any[]) => {
      keyboardEvents.forEach((event: any) => {
        const { timestamp, unique_selector } = event;

        setTimeout(() => {
          updateInputValue(sessionFrame, unique_selector, (val) => val + "*");
        }, timestamp - initialTimestamp);
      });
    };

    const clearAllInputs = (keyboardEvents: any[]) => {
      const uniqueSelectors = Array.from(
        new Set(keyboardEvents.map((e) => e.unique_selector))
      );

      uniqueSelectors.forEach((selector) => {
        updateInputValue(sessionFrame, selector, () => "");
      });
    };

    const showMouseDots = (mouseEvents: any[]) => {
      mouseEvents.forEach((event: any) => {
        const { timestamp } = event;
        const isClick = event.name === "click";
        const div = document.getElementById(event.id);
        if (!div) return;

        setTimeout(() => {
          div.classList.add("visible");
          if (isClick) {
            div.classList.add("click");
          }
          setTimeout(() => {
            div.classList.remove("visible");
            if (isClick) {
              div.classList.remove("click");
            }
          }, 1000);
        }, timestamp - initialTimestamp);
      });
    };

    const execGif = () => {
      uiEvents().forEach((event, index, arr) => {
        const { timestamp } = event;

        setTimeout(() => {
          requestAnimationFrame(() => {
            Object.assign(sessionFrame, {
              width: event.properties.innerWidth,
              height: event.properties.htmlHeight,
              srcdoc: event.properties.screenshot,
            });
          });

          if (index === arr.length - 1) {
            setTimeout(() => {
              clearAllInputs(keydownEvents());
              execGif();
            }, events[events.length - 1].timestamp - timestamp + 1000);
          }
        }, timestamp - initialTimestamp);
      });

      showMouseDots(mousemoveEvents());
      showMouseDots(clickEvents());
      typeOnInputs(keydownEvents());
    };

    execGif();
  });

  return (
    <div class="session-player">
      <SessionFrames uiEvents={uiEvents()} />
      <MouseEvents mouseEvents={mousemoveEvents()} />
      <MouseEvents mouseEvents={clickEvents()} />
    </div>
  );
}

export default SessionPlayer;
