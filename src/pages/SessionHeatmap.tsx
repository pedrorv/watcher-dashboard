import { Show, createResource } from "solid-js";
import { useParams } from "@solidjs/router";
import { SERVER_HOST } from "@/config";
import { Header } from "@/components/Header";
import { Spinner } from "@/components/Spinner";
import { Heatmap } from "@/components/Heatmap";
import { HeatmapService } from "@/app/HeatmapService";
import { getTexts } from "@/lib/localization";

import "./SessionHeatmap.scss";

const getEvents = (sessionId: string): Promise<any[]> =>
  fetch(`${SERVER_HOST}/events/${sessionId}`)
    .then((res) => res.json())
    .then(HeatmapService.filterHeatmapEvents)
    .catch(() => []);

export const SessionHeatmap = () => {
  const texts = getTexts().pages.heatmap;
  const params = useParams();
  const [events] = createResource(() => params.id, getEvents);

  return (
    <main class="page session-heatmap">
      <Header heading={texts.heading} />
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
