import {
  createEffect,
  Show,
  JSX,
  createSignal,
  createResource,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import { getAuthToken, getIsAuthorized, setAuthToken } from "@/auth";
import { Spinner } from "@/components/Spinner";
import { getTexts } from "@/lib/localization";

import "./SignIn.scss";

export const SignIn = () => {
  const texts = getTexts().pages.signIn;
  const [error, setError] = createSignal(false);
  const [token, setToken] = createSignal("");
  const navigate = useNavigate();
  const [isAuthorized] = createResource(token, getIsAuthorized);

  const onInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (
    event
  ) => {
    setError(false);
    setAuthToken(event.target.value);
  };

  createEffect(() => {
    if (isAuthorized.loading) return;

    if (isAuthorized()) {
      navigate("/", { replace: true });
    } else if (token()) {
      setError(true);
    }
  });

  return (
    <main class="page sign-in">
      <Show when={!isAuthorized()} fallback={<Spinner size={60} />}>
        <h1>{texts.heading}</h1>
        <input
          type="password"
          classList={{ error: error() }}
          onInput={onInput}
        />
        <button onClick={() => setToken(getAuthToken())}>{texts.button}</button>
      </Show>
    </main>
  );
};
