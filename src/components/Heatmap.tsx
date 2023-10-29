import { createMemo, createEffect } from "solid-js";

import { HeatmapService } from "@/app/HeatmapService";
import { calcScaleRatio } from "@/lib/scale";

import "./Heatmap.scss";

export const Heatmap = (props: { events: any[] }) => {
  const heatmapService = new HeatmapService(props.events);
  const uiEvent = createMemo(
    () => props.events.filter((e) => e.type === "ui")[0]
  );

  createEffect(() => {
    heatmapService.show();
  });

  const heightRatio = createMemo(() => {
    const { innerHeight } = window;
    return calcScaleRatio(innerHeight, uiEvent().properties.htmlHeight);
  });
  const widthRatio = createMemo(() => {
    const { innerWidth } = window;
    return calcScaleRatio(innerWidth, uiEvent().properties.htmlWidth);
  });
  const ratio = createMemo(() => Math.min(heightRatio(), widthRatio()));

  return (
    <div
      id="heatmap"
      class="heatmap"
      style={{
        transform: `scale(${ratio()}) translate(-50%, calc(-50% - 62px))`,
      }}
    >
      <iframe
        style={{ border: "none", margin: "0 auto" }}
        width={uiEvent().properties.innerWidth}
        height={uiEvent().properties.htmlHeight}
        srcdoc={uiEvent().properties.screenshot}
      />
    </div>
  );
};
