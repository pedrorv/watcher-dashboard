import { Show, createResource } from "solid-js";
import { useParams } from "@solidjs/router";
import { HOST } from "@/config";
import { Spinner } from "@/components/Spinner";
import { SessionPlayer } from "@/components/SessionPlayer";
import { SessionPlayerService } from "@/app/SessionPlayerService";

import "./SessionRecording.scss";

const getEvents = (sessionId: string): Promise<any[]> =>
  fetch(`${HOST}/events/${sessionId}`)
    .then((res) => res.json())
    .then(SessionPlayerService.filterSessionEvents)
    .catch(() => []);

export const SessionRecording = () => {
  const params = useParams();
  const [events] = createResource(() => params.id, getEvents);

  return (
    <main class="page session-recording">
      <header>
        <h1>Session Recording</h1>
      </header>
      <section>
        <Show
          when={!events.loading && events.state === "ready"}
          fallback={<Spinner size={60} />}
        >
          <SessionPlayer events={events()!} />
        </Show>
      </section>
    </main>
  );
};
