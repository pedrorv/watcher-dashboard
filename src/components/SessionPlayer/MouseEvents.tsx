import { For } from "solid-js";

export const MouseEvents = ({ mouseEvents }: { mouseEvents: any[] }) => {
  return (
    <>
      <For each={mouseEvents}>
        {(event) => {
          const isClick = event.name === "click";
          const { pageX, pageY, clientX, clientY } = event.properties;

          return (
            <div
              id={event.id}
              class="mouse-event"
              style={{
                position: "absolute",
                border: isClick ? "2px solid #bf0603" : undefined,
                background: isClick ? "transparent" : "#bf0603",
                opacity: isClick ? 0.8 : 0.3,
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
