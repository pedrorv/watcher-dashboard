import { Show, createResource } from "solid-js";
import { useParams } from "@solidjs/router";
import { Spinner } from "@/components/Spinner";
import { SessionPlayer } from "@/components/SessionPlayer";
import { SessionPlayerService } from "@/app/SessionPlayerService";

import "./SessionHeatmap.scss";

const getEvents = (sessionId: string): Promise<any[]> =>
  fetch(`http://localhost:3000/events/${sessionId}`)
    .then((res) => res.json())
    .then(SessionPlayerService.filterSessionEvents)
    .catch(() => []);

export const SessionHeatmap = () => {
  const params = useParams();
  const [events] = createResource(() => params.id, getEvents);

  return (
    <main class="page session-heatmap">
      <header>
        <h1>Session</h1>
        <h3>{params.id}</h3>
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
