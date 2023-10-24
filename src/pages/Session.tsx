import { useParams } from "@solidjs/router";

function Session() {
  const params = useParams();

  return (
    <main class="page">
      <header>
        <h1>Session</h1>
        <h3>{params.id}</h3>
      </header>
    </main>
  );
}

export default Session;
