import { For, createResource } from "solid-js";
import { A } from "@solidjs/router";
import { HOST } from "@/config";
import { Spinner } from "../components/Spinner";

const getSessions = (
  appId: string
): Promise<{ id: string; lastEventTimestamp: number }[]> =>
  fetch(`${HOST}/sessions/${appId}`, {
    headers: { "auth-token": getAuthToken() },
  })
    .then((res) => res.json())
    .catch(() => []);

import "./Home.scss";
import { getAuthToken } from "@/auth";

export const Home = () => {
  const appId = "ebf05be7-d3fe-4df3-a789-0a641747d7a2";
  const [sessions] = createResource(appId, getSessions);

  return (
    <main class="page home">
      <header>
        <h1>Sessions</h1>
      </header>
      <section>
        <For each={sessions()} fallback={<Spinner size={60} />}>
          {(session) => (
            <div class="session-card">
              <h1>Session {session.id}</h1>
              <p>on {new Date(session.lastEventTimestamp).toISOString()}</p>

              <nav>
                <A href={`/session/${session.id}/recording`}>
                  <button>Recording</button>
                </A>
                <A href={`/session/${session.id}/heatmap`}>
                  <button>Heatmap</button>
                </A>
              </nav>
            </div>
          )}
        </For>
      </section>
    </main>
  );
};
