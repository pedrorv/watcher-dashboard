import { createMemo } from "solid-js";
import "./SessionControls.scss";

type SessionControlsProps = {
  playing: boolean;
  togglePlaying: () => void;
  stopPlaying: () => void;
  minTimestamp: number;
  curTimestamp: number;
  maxTimestamp: number;
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

  return (
    <div class="session-controls">
      <div
        class="play-pause-btn"
        classList={{ pause: props.playing }}
        onClick={props.togglePlaying}
      />
      <div class="stop-btn" onClick={props.stopPlaying} />
      <div class="track-container">
        <div class="track-background" />
        <div class="track-foreground" style={{ width: `${percentage()}%` }} />
        <div class="track-dot" style={{ left: `${percentage()}%` }} />
      </div>
    </div>
  );
};
