import HeatmapJS from "@/lib/heatmap";

const MOVE_VAL = 1;
const MIN_VAL = MOVE_VAL;
const CLICK_VAL = 5;
const MAX_VAL = 10;

export class HeatmapService {
  constructor(private events: any[]) {}

  static filterHeatmapEvents(events: any[]) {
    return events.filter((e) =>
      ["dom-change", "mousemove", "click"].includes(e.name)
    );
  }

  private get mouseEvents(): any[] {
    return this.events.filter((e) => e.type === "mouse");
  }

  show(): void {
    const heatmap = HeatmapJS.create({
      container: document.getElementById("heatmap") as HTMLElement,
    });

    const data = this.mouseEvents.map((event: any) => {
      const isClick = event.name === "click";
      const { clientX, clientY } = event.properties;

      return {
        x: clientX,
        y: clientY,
        value: isClick ? CLICK_VAL : MOVE_VAL,
      };
    });

    heatmap.setData({ min: MIN_VAL, max: MAX_VAL, data });
  }
}
