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

  createEffect(() => {
    const initialTimestamp = events[0].timestamp;

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
            currentIframe.style.display = "block";

            if (previousIframe) {
              previousIframe.style.display = "none";
            }

            if (index === arr.length - 1) {
              setTimeout(
                execGif,
                events[events.length - 1].timestamp - initialTimestamp + 1000
              );
            }
          }
        }, timestamp - initialTimestamp);
      });

      showMouseDots(mousemoveEvents());
      showMouseDots(clickEvents());
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
