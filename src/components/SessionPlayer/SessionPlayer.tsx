import { createMemo, createEffect, createSignal } from "solid-js";

import { SessionFrames } from "./SessionFrames";
import { MouseEvents } from "./MouseEvents";
import { SessionPlayerService } from "@/app/SessionPlayerService";

import "./SessionPlayer.scss";
import { SessionControls } from "./SessionControls";
import { first, last } from "@/lib/array";
import { calcScaleRatio } from "@/lib/scale";

export const SessionPlayer = (props: { events: any[] }) => {
  const uiEvents = createMemo(() =>
    props.events.filter((e) => e.type === "ui")
  );
  const mouseEvents = createMemo(() =>
    props.events.filter((e) => e.type === "mouse")
  );
  const minTimestamp = first(props.events)?.timestamp;
  const maxTimestamp = last(props.events)?.timestamp;
  const [curTimestamp, setCurTimestamp] = createSignal(minTimestamp);
  const [playing, setPlaying] = createSignal(false);
  const [playerDimensions, setPlayerDimensions] = createSignal({
    width: uiEvents()[0].properties.innerWidth,
    height: uiEvents()[0].properties.innerHeight,
  });
  const [playerScroll, setPlayerScroll] = createSignal({
    scrollX: 0,
    scrollY: 0,
  });

  const togglePlaying = () => {
    if (playing()) {
      sessionPlayerService.pause();
    } else {
      sessionPlayerService.play();
    }
    setPlaying(!playing());
  };
  const stopPlaying = () => {
    setPlaying(false);
    sessionPlayerService.stop();
  };
  const activeIframe = document.querySelector(
    "session-frame.visible"
  ) as HTMLIFrameElement;
  const sessionPlayerState = {
    activeIframe,
    timers: [],
    curTimestamp: curTimestamp(),
    playerScroll: playerScroll(),
  };
  const sessionPlayerService = new SessionPlayerService(
    sessionPlayerState,
    props.events,
    {
      setCurTimestamp,
      setPlayerDimensions,
      setPlayerScroll,
    }
  );

  createEffect(() => {
    if (curTimestamp() === maxTimestamp) {
      setPlaying(false);
    }
  });

  const updatePlayerSize = () => {
    const sessionPlayer = document.getElementById("session-player");

    if (sessionPlayer) {
      const { innerHeight, innerWidth } = window;
      const hScale = calcScaleRatio(innerHeight, playerDimensions().height);
      const wScale = calcScaleRatio(innerWidth, playerDimensions().width);
      const ratio = Math.min(hScale, wScale);

      Object.assign(sessionPlayer.style, {
        width: playerDimensions().width + "px",
        height: playerDimensions().height + "px",
        transform: `scale(${ratio}) translate(-50%, calc(-50% - 62px))`,
      });
    }
    requestAnimationFrame(updatePlayerSize);
  };
  requestAnimationFrame(updatePlayerSize);

  const updatePlayerScroll = () => {
    const sessionPlayer = document.getElementById("session-player-scroll");

    if (sessionPlayer) {
      Object.assign(sessionPlayer.style, {
        transform: `translate(${-playerScroll().scrollX}px, ${-playerScroll()
          .scrollY}px)`,
      });
    }
    requestAnimationFrame(updatePlayerScroll);
  };
  requestAnimationFrame(updatePlayerScroll);

  return (
    <>
      <div id="session-player" class="session-player">
        <div id="session-player-scroll">
          <SessionFrames uiEvents={uiEvents()} />
          <MouseEvents mouseEvents={mouseEvents()} />
        </div>
      </div>
      <SessionControls
        playing={playing()}
        togglePlaying={togglePlaying}
        stopPlaying={stopPlaying}
        minTimestamp={minTimestamp}
        curTimestamp={curTimestamp()}
        maxTimestamp={maxTimestamp}
      />
    </>
  );
};
