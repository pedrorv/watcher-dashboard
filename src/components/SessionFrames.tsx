import { For } from "solid-js";

function SessionFrames({ uiEvents }: { uiEvents: any[] }) {
  return (
    <>
      <For each={uiEvents}>
        {(event) => (
          <iframe
            id={event.id}
            class="session-frame"
            style={{ border: "none", margin: "0 auto" }}
            width={event.properties.innerWidth}
            height={event.properties.htmlHeight}
            srcdoc={event.properties.screenshot}
          />
        )}
      </For>
    </>
  );
}

export default SessionFrames;
