import { createMemo, createEffect } from "solid-js";

import { HeatmapService } from "@/app/HeatmapService";

import "./Heatmap.scss";

export const Heatmap = (props: { events: any[] }) => {
  const heatmapService = new HeatmapService(props.events);
  const uiEvent = createMemo(
    () => props.events.filter((e) => e.type === "ui")[0]
  );

  createEffect(() => {
    heatmapService.show();
  });

  return (
    <div id="heatmap" class="heatmap">
      <iframe
        style={{ border: "none", margin: "0 auto" }}
        width={uiEvent().properties.innerWidth}
        height={uiEvent().properties.htmlHeight}
        srcdoc={uiEvent().properties.screenshot}
      />
    </div>
  );
};
