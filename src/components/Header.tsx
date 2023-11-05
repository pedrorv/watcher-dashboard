import { Component, Show } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";

import "./Header.scss";

interface HeaderProps {
  heading: string;
}

export const Header: Component<HeaderProps> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const goToHeatmap = () =>
    navigate(location.pathname.replace("recording", "heatmap"));
  const goToRecording = () =>
    navigate(location.pathname.replace("heatmap", "recording"));
  const isHeatmap = location.pathname.endsWith("heatmap");
  const isRecording = location.pathname.endsWith("recording");

  const hidden = !isHeatmap && !isRecording;

  return (
    <header>
      <button class="arrow" onClick={goBack}>
        &#8249;
      </button>
      <h1>{props.heading}</h1>
      <button
        onClick={isHeatmap ? goToRecording : goToHeatmap}
        classList={{ hidden }}
      >
        {isHeatmap ? "Gravação" : "Mapa de calor"}
      </button>
    </header>
  );
};
