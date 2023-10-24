import { For, createResource } from "solid-js";
import { A } from "@solidjs/router";

const getSessions = (appId: string): Promise<string[]> =>
  fetch(`http://localhost:3000/sessions/${appId}`)
    .then((res) => res.json())
    .catch(() => []);

function Home() {
  const appId = "ebf05be7-d3fe-4df3-a789-0a641747d7a2";
  const [sessions] = createResource(appId, getSessions);

  return (
    <main class="page">
      <header>
        <h1>Sessions</h1>
      </header>
      <section>
        <For each={sessions()}>
          {(session) => <A href={`/session/${session}`}>{session}</A>}
        </For>
      </section>
    </main>
  );
}

export default Home;
