import { For } from "solid-js";

export const SessionFrames = ({ uiEvents }: { uiEvents: any[] }) => {
  return (
    <>
      <For each={uiEvents}>
        {(event, i) => (
          <iframe
            id={event.id}
            class="session-frame"
            classList={{ visible: !i() }}
            style={{ border: "none", margin: "0 auto" }}
            width={event.properties.htmlWidth}
            height={event.properties.htmlHeight}
            srcdoc={event.properties.screenshot}
          />
        )}
      </For>
    </>
  );
};
