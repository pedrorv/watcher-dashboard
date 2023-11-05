import { For, createResource } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { SERVER_HOST } from "@/config";
import { Header } from "@/components/Header";
import { Spinner } from "@/components/Spinner";

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
  const params = useParams();
  const [sessions] = createResource(params.appId, getSessions);

  return (
    <main class="page sessions">
      <Header heading="Sessões" />
      <section>
        <For each={sessions()} fallback={<Spinner size={60} />}>
          {(session) => (
            <div class="session-card">
              <h1>Sessão {session.id}</h1>
              <p>
                em{" "}
                {new Date(session.lastEventTimestamp).toLocaleString("pt-BR")}
              </p>

              <nav>
                <A href={`/session/${session.id}/recording`}>
                  <button>Gravação</button>
                </A>
                <A href={`/session/${session.id}/heatmap`}>
                  <button>Mapa de calor</button>
                </A>
              </nav>
            </div>
          )}
        </For>
      </section>
    </main>
  );
};
