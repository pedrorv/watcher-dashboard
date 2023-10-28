import HeatmapJS from "@/lib/heatmap";

const MOVE_VAL = 1;
const MIN_VAL = MOVE_VAL;
const MOUSEUP_VAL = 2;
const MOUSEDOWN_VAL = 3;
const CLICK_VAL = 5;
const MAX_VAL = 15;

const mouseEventNameToVal = (name: string): number => {
  switch (name) {
    case "click":
      return CLICK_VAL;
    case "mousedown":
      return MOUSEDOWN_VAL;
    case "mouseup":
      return MOUSEUP_VAL;
    default:
      return MOVE_VAL;
  }
};

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

    const data = this.mouseEvents.map((event) => ({
      x: event.properties.clientX,
      y: event.properties.clientY,
      value: mouseEventNameToVal(event.name),
    }));

    heatmap.setData({ min: MIN_VAL, max: MAX_VAL, data });
  }
}
