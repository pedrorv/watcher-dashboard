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

    const typeOnInputs = () => {
      keydownEvents().forEach((event: any) => {
        const { timestamp, unique_selector } = event;

        setTimeout(() => {
          updateInputValue(activeIframe, unique_selector, (val) => val + "*");
        }, timestamp - initialTimestamp);
      });
    };

    const clearAllInputs = () => {
      const uniqueSelectors = Array.from(
        new Set(keydownEvents().map((e) => e.unique_selector))
      );
      const iframes = uiEvents().map((e) => document.getElementById(e.id));

      uniqueSelectors.forEach((selector) => {
        iframes.forEach((iframe) => {
          updateInputValue(iframe as HTMLIFrameElement, selector, () => "");
        });
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
          const previous = arr[index - 1] ?? arr[arr.length - 1];
          const currentIframe = document.getElementById(event.id);
          const previousIframe = document.getElementById(previous.id);

          if (currentIframe) {
            activeIframe = currentIframe as HTMLIFrameElement;

            requestAnimationFrame(() => {
              currentIframe.classList.add("visible");

              if (previousIframe) {
                previousIframe.classList.remove("visible");
              }

              requestAnimationFrame(() => {});
            });

            if (index === arr.length - 1) {
              setTimeout(() => {
                clearAllInputs();
                execGif();
              }, events[events.length - 1].timestamp - timestamp + 1000);
            }
          }
        }, timestamp - initialTimestamp);
      });

      showMouseDots(mousemoveEvents());
      showMouseDots(clickEvents());
      typeOnInputs();
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
