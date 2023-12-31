import { Show, createResource } from "solid-js";
import { useParams } from "@solidjs/router";
import { SERVER_HOST } from "@/config";
import { Header } from "@/components/Header";
import { Spinner } from "@/components/Spinner";
import { SessionPlayer } from "@/components/SessionPlayer";
import { SessionPlayerService } from "@/app/SessionPlayerService";
import { getTexts } from "@/lib/localization";

import "./SessionRecording.scss";

const getEvents = (sessionId: string): Promise<any[]> =>
  fetch(`${SERVER_HOST}/events/${sessionId}`)
    .then((res) => res.json())
    .then(SessionPlayerService.filterSessionEvents)
    .catch(() => []);

export const SessionRecording = () => {
  const texts = getTexts().pages.recording;
  const params = useParams();
  const [events] = createResource(() => params.id, getEvents);

  return (
    <main class="page session-recording">
      <Header heading={texts.heading} />
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
