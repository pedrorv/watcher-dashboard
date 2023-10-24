import { For } from "solid-js";

function SessionFrames({ uiEvents }: { uiEvents: any[] }) {
  return (
    <>
      <For each={uiEvents}>
        {(event) => (
          <iframe
            id={event.id}
            style={{ border: "none", display: "none", margin: "0 auto" }}
            width={event.properties.innerWidth}
            height={event.properties.innerHeight}
            src={`data:text/html;base64,${btoa(event.properties.screenshot)}`}
          />
        )}
      </For>
    </>
  );
}

export default SessionFrames;
