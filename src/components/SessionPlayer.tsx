import { createMemo, createEffect } from "solid-js";
import SessionFrames from "../components/SessionFrames";
import MouseEvents from "../components/MouseEvents";

import "./SessionPlayer.scss";

function SessionPlayer({ events }: { events: any[] }) {
  const uiEvents = createMemo(() => events.filter((e) => e.type === "ui"));
  const mouseEvents = createMemo(() =>
    events.filter((e) => e.type === "mouse")
  );
  const keydownEvents = createMemo(() =>
    events.filter((e) => e.type === "keyboard" && e.name === "keydown")
  );

  createEffect(() => {
    const initialTimestamp = events[0].timestamp;
    let activeIframe: HTMLIFrameElement;

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

    const displayKeydownEvent = ({
      unique_selector,
    }: {
      unique_selector: string;
    }) => {
      updateInputValue(activeIframe, unique_selector, (val) => val + "*");
    };

    const clearAllInputs = () => {
      const uniqueSelectors = Array.from(
        new Set(keydownEvents().map((e) => e.unique_selector))
      );
      const iframes = document.querySelectorAll("iframe.session-frame");

      uniqueSelectors.forEach((selector) => {
        iframes.forEach((iframe) => {
          updateInputValue(iframe as HTMLIFrameElement, selector, () => "");
        });
      });
    };

    const displayMouseEvent = (event: any) => {
      const isClick = event.name === "click";
      const div = document.getElementById(event.id);
      if (!div) return;

      div.classList.add("visible");
      if (isClick) {
        div.classList.add("click");
      }
    };

    const hideMouseEvent = (event: any) => {
      const isClick = event.name === "click";
      const div = document.getElementById(event.id);
      if (!div) return;

      div.classList.remove("visible");
      if (isClick) {
        div.classList.remove("click");
      }
    };

    const displayUIEvent = (event: any) => {
      const currentIframe = document.getElementById(event.id);
      const previousIframe = activeIframe;

      if (currentIframe) {
        activeIframe = currentIframe as HTMLIFrameElement;

        currentIframe.classList.add("visible");

        if (previousIframe) {
          previousIframe.classList.remove("visible");
        }
      }
    };

    const execGif = () => {
      events.forEach((event, index, arr) => {
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
              clearAllInputs();
              execGif();
            }, 2000);
          }
        }, timestamp - initialTimestamp);
      });
    };

    execGif();
  });

  return (
    <div class="session-player">
      <SessionFrames uiEvents={uiEvents()} />
      <MouseEvents mouseEvents={mouseEvents()} />
    </div>
  );
}

export default SessionPlayer;
