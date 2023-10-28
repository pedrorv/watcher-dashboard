import { createMemo, createEffect } from "solid-js";

import { SessionFrames } from "./SessionFrames";
import { MouseEvents } from "./MouseEvents";
import { PlaySession } from "@/use-cases/PlaySession";

import "./SessionPlayer.scss";

export const SessionPlayer = ({ events }: { events: any[] }) => {
  const uiEvents = createMemo(() => events.filter((e) => e.type === "ui"));
  const mouseEvents = createMemo(() =>
    events.filter((e) => e.type === "mouse")
  );

  createEffect(() => new PlaySession(events).execute());

  return (
    <div class="session-player">
      <SessionFrames uiEvents={uiEvents()} />
      <MouseEvents mouseEvents={mouseEvents()} />
    </div>
  );
};
