import { Routes, Route } from "@solidjs/router";
import { Apps } from "@/pages/Apps";
import { Sessions } from "@/pages/Sessions";
import { SignIn } from "@/pages/SignIn";
import { AuthorizedOnly } from "@/pages/AuthorizedOnly";
import { SessionRecording } from "@/pages/SessionRecording";
import { SessionHeatmap } from "@/pages/SessionHeatmap";

import "./Pages.scss";

export const App = () => (
  <Routes>
    <Route path="/auth" component={SignIn} />
    <Route path="/" component={AuthorizedOnly}>
      <Route path="/" component={Apps} />
      <Route path="/:appId/sessions" component={Sessions} />
    </Route>
    <Route path="/session/:id/recording" component={SessionRecording} />
    <Route path="/session/:id/heatmap" component={SessionHeatmap} />
  </Routes>
);
