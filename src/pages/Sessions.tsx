import { For, createResource } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { SERVER_HOST } from "@/config";
import { Header } from "@/components/Header";
import { Spinner } from "@/components/Spinner";
import { getTexts } from "@/lib/localization";

const getSessions = (
  appId: string
): Promise<{ id: string; lastEventTimestamp: number }[]> =>
  fetch(`${SERVER_HOST}/sessions/${appId}`, {
    headers: { "auth-token": getAuthToken() },
  })
    .then((res) => res.json())
    .catch(() => []);

import "./Sessions.scss";
import { getAuthToken } from "@/auth";

export const Sessions = () => {
  const texts = getTexts().pages.sessions;
  const params = useParams();
  const [sessions] = createResource(params.appId, getSessions);

  return (
    <main class="page sessions">
      <Header heading={texts.heading} />
      <section>
        <For each={sessions()} fallback={<Spinner size={60} />}>
          {(session) => (
            <div class="session-card">
              <h1>{texts.cardHeading(session.id)}</h1>
              <p>{texts.cardSubheading(session.lastEventTimestamp)}</p>

              <nav>
                <A href={`/session/${session.id}/recording`}>
                  <button>{texts.navRecording}</button>
                </A>
                <A href={`/session/${session.id}/heatmap`}>
                  <button>{texts.navHeatmap}</button>
                </A>
              </nav>
            </div>
          )}
        </For>
      </section>
    </main>
  );
};
