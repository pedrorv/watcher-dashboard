import { createMemo, createEffect, createSignal } from "solid-js";

import { SessionFrames } from "./SessionFrames";
import { MouseEvents } from "./MouseEvents";
import { SessionPlayerService } from "@/app/SessionPlayerService";

import "./SessionPlayer.scss";
import { SessionControls } from "./SessionControls";
import { first, last } from "@/lib/array";

export const SessionPlayer = (props: { events: any[] }) => {
  const minTimestamp = first(props.events)?.timestamp;
  const maxTimestamp = last(props.events)?.timestamp;
  const [curTimestamp, setCurTimestamp] = createSignal(minTimestamp);
  const [playing, setPlaying] = createSignal(false);
  const togglePlaying = () => setPlaying(!playing());
  const uiEvents = createMemo(() =>
    props.events.filter((e) => e.type === "ui")
  );
  const mouseEvents = createMemo(() =>
    props.events.filter((e) => e.type === "mouse")
  );
  const activeIframe = document.querySelector(
    "session-frame.visible"
  ) as HTMLIFrameElement;
  const sessionPlayerState = {
    activeIframe,
    timers: [],
    curTimestamp: curTimestamp(),
  };
  const sessionPlayerService = new SessionPlayerService(
    sessionPlayerState,
    props.events,
    setCurTimestamp
  );

  createEffect(() => {
    if (playing()) {
      sessionPlayerService.play();
    } else {
      sessionPlayerService.pause();
    }
  });

  return (
    <>
      <div class="session-player">
        <SessionFrames uiEvents={uiEvents()} />
        <MouseEvents mouseEvents={mouseEvents()} />
      </div>
      <SessionControls
        playing={playing()}
        togglePlaying={togglePlaying}
        minTimestamp={minTimestamp}
        curTimestamp={curTimestamp()}
        maxTimestamp={maxTimestamp}
      />
    </>
  );
};
