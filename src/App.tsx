import { Routes, Route } from "@solidjs/router";
import { Home } from "@/pages/Home";
import { SessionRecording } from "@/pages/SessionRecording";
import { SessionHeatmap } from "@/pages/SessionHeatmap";

import "./Pages.scss";

export const App = () => (
  <Routes>
    <Route path="/" component={Home} />
    <Route path="/session/:id/recording" component={SessionRecording} />
    <Route path="/session/:id/heatmap" component={SessionHeatmap} />
  </Routes>
);
