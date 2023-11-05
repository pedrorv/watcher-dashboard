import HeatmapJS from "@/lib/heatmap";

const MOVE_VAL = 1;
const MIN_VAL = MOVE_VAL;
const DRAG_VAL = MOVE_VAL;
const MOUSEUP_VAL = 2;
const DRAGSTART_VAL = 3;
const MOUSEDOWN_VAL = 3;
const DROP_VAL = 5;
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

const dragEventNameToVal = (name: string): number => {
  switch (name) {
    case "drag":
      return DRAG_VAL;
    case "dragstart":
      return DRAGSTART_VAL;
    case "drop":
      return DROP_VAL;
    default:
      return 0;
  }
};

export class HeatmapService {
  constructor(private events: any[]) {}

  static filterHeatmapEvents(events: any[]) {
    return events.filter((e) => ["ui", "mouse", "drag"].includes(e.type));
  }

  private get dragEvents(): any[] {
    return this.events.filter((e) => e.type === "drag");
  }

  private get mouseEvents(): any[] {
    return this.events.filter((e) => e.type === "mouse");
  }

  show(): void {
    const heatmap = HeatmapJS.create({
      container: document.getElementById("heatmap") as HTMLElement,
    });

    const dragEventsAsData = this.dragEvents.map((event) => ({
      x: event.properties.pageX ?? event.properties.clientX,
      y: event.properties.pageY ?? event.properties.clientY,
      value: dragEventNameToVal(event.name),
    }));

    const mouseEventsAsData = this.mouseEvents.map((event) => ({
      x: event.properties.pageX ?? event.properties.clientX,
      y: event.properties.pageY ?? event.properties.clientY,
      value: mouseEventNameToVal(event.name),
    }));

    const data = mouseEventsAsData.concat(dragEventsAsData);

    heatmap.setData({ min: MIN_VAL, max: MAX_VAL, data });
  }
}
