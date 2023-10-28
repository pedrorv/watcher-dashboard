import { Show, createResource } from "solid-js";
import { useParams } from "@solidjs/router";
import { Spinner } from "@/components/Spinner";
import { Heatmap } from "@/components/Heatmap";
import { HeatmapService } from "@/app/HeatmapService";

import "./SessionHeatmap.scss";

const getEvents = (sessionId: string): Promise<any[]> =>
  fetch(`http://localhost:3000/events/${sessionId}`)
    .then((res) => res.json())
    .then(HeatmapService.filterHeatmapEvents)
    .catch(() => []);

export const SessionHeatmap = () => {
  const params = useParams();
  const [events] = createResource(() => params.id, getEvents);

  return (
    <main class="page session-heatmap">
      <header>
        <h1>Session Heatmap</h1>
      </header>
      <section>
        <Show
          when={!events.loading && events.state === "ready"}
          fallback={<Spinner size={60} />}
        >
          <Heatmap events={events()!} />
        </Show>
      </section>
    </main>
  );
};
