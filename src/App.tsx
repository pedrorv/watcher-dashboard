import { Routes, Route } from "@solidjs/router";
import Home from "./pages/Home";
import Session from "./pages/Session";

import "./Pages.scss";

export default () => (
  <Routes>
    <Route path="/" component={Home} />
    <Route path="/session/:id" component={Session} />
  </Routes>
);
