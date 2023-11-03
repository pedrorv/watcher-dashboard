import { createMemo, JSX } from "solid-js";
import "./SessionControls.scss";

type SessionControlsProps = {
  playing: boolean;
  togglePlaying: () => void;
  stopPlaying: () => void;
  setTimestamp: (timestamp: number) => void;
  minTimestamp: number;
  curTimestamp: number;
  maxTimestamp: number;
};

const millisToSeconds = (n: number) => Math.round(n / 1000);
const secondsToClock = (n: number) => {
  const hour = 60 * 60;
  const minute = 60;

  const hours = Math.floor(n / hour)
    .toString()
    .padStart(2, "0");
  const hoursRemainder = n % hour;
  const minutes = Math.floor(hoursRemainder / minute)
    .toString()
    .padStart(2, "0");
  const seconds = (hoursRemainder % minute).toString().padStart(2, "0");

  if (hours !== "00") {
    return `${hours}:${minutes}:${seconds}`;
  }

  return `${minutes}:${seconds}`;
};

export const SessionControls = (props: SessionControlsProps) => {
  const percentage = createMemo(() =>
    Math.max(
      0,
      Math.min(
        100,
        ((props.curTimestamp - props.minTimestamp) /
          (props.maxTimestamp - props.minTimestamp)) *
          100
      )
    )
  );

  const onClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (event) => {
    const trackContainer = document.querySelector(".track-container");
    if (!trackContainer) return;

    const { left, width } = trackContainer.getBoundingClientRect();
    const x = event.clientX - left;
    const ratio = x / width;
    const diff = props.maxTimestamp - props.minTimestamp;
    const moveToTimestamp = Math.round(props.minTimestamp + ratio * diff);

    props.setTimestamp(moveToTimestamp);
  };

  const elapsedClock = createMemo(() =>
    secondsToClock(millisToSeconds(props.curTimestamp - props.minTimestamp))
  );
  const durationClock = createMemo(() =>
    secondsToClock(millisToSeconds(props.maxTimestamp - props.minTimestamp))
  );

  return (
    <div class="session-controls">
      <div
        class="play-pause-btn"
        classList={{ pause: props.playing }}
        onClick={props.togglePlaying}
      />
      <div class="stop-btn" onClick={props.stopPlaying} />
      <div class="clock elapsed">{elapsedClock()}</div>
      <div class="track-container" onClick={onClick}>
        <div class="track-background" />
        <div class="track-foreground" style={{ width: `${percentage()}%` }} />
        <div class="track-dot" style={{ left: `${percentage()}%` }} />
      </div>
      <div class="clock duration">{durationClock()}</div>
    </div>
  );
};
