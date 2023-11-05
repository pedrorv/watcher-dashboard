import { For } from "solid-js";

export const DragEvents = ({ dragEvents }: { dragEvents: any[] }) => {
  return (
    <>
      <For each={dragEvents}>
        {(event) => {
          const isDropOrStart = ["dragstart", "drop"].includes(event.name);
          const { pageX, pageY, clientX, clientY } = event.properties;

          return (
            <div
              id={event.id}
              class="drag-event"
              style={{
                position: "absolute",
                border: isDropOrStart ? "2px solid #bf0603" : undefined,
                background: isDropOrStart ? "transparent" : "#bf0603",
                opacity: isDropOrStart ? 0.8 : 0.3,
                top: `${pageY ?? clientY}px`,
                left: `${pageX ?? clientX}px`,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        }}
      </For>
    </>
  );
};
