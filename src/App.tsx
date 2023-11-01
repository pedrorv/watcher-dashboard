import { Routes, Route } from "@solidjs/router";
import { Home } from "@/pages/Home";
import { SignIn } from "@/pages/SignIn";
import { AuthorizedOnly } from "@/pages/AuthorizedOnly";
import { SessionRecording } from "@/pages/SessionRecording";
import { SessionHeatmap } from "@/pages/SessionHeatmap";

import "./Pages.scss";

export const App = () => (
  <Routes>
    <Route path="/auth" component={SignIn} />
    <Route path="/" component={AuthorizedOnly}>
      <Route path="/" component={Home} />
    </Route>
    <Route path="/session/:id/recording" component={SessionRecording} />
    <Route path="/session/:id/heatmap" component={SessionHeatmap} />
  </Routes>
);
