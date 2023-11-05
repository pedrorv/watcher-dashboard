import { For, createResource } from "solid-js";
import { A } from "@solidjs/router";
import { SERVER_HOST } from "@/config";
import { Header } from "@/components/Header";
import { Spinner } from "@/components/Spinner";

const getApps = (): Promise<{ id: string; domain: string }[]> =>
  fetch(`${SERVER_HOST}/apps`, {
    headers: { "auth-token": getAuthToken() },
  })
    .then((res) => res.json())
    .catch(() => []);

import "./Apps.scss";
import { getAuthToken } from "@/auth";

export const Apps = () => {
  const [apps] = createResource(getApps);

  return (
    <main class="page apps">
      <Header heading="Apps" />
      <section>
        <For each={apps()} fallback={<Spinner size={60} />}>
          {(app) => (
            <div class="app-card">
              <h1>App {app.id}</h1>
              <p>{app.domain}</p>

              <nav>
                <A href={`/${app.id}/sessions`}>
                  <button>Sessões</button>
                </A>
              </nav>
            </div>
          )}
        </For>
      </section>
    </main>
  );
};
