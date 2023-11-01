import { createEffect, createResource } from "solid-js";
import { Outlet, useNavigate } from "@solidjs/router";
import { getAuthToken, getIsAuthorized } from "@/auth";

import "./SignIn.scss";

export const AuthorizedOnly = () => {
  const [isAuthorized] = createResource(getAuthToken(), getIsAuthorized);
  const navigate = useNavigate();

  createEffect(() => {
    if (isAuthorized.loading) return;
    if (!isAuthorized()) {
      navigate("/auth", { replace: true });
    }
  });

  return <Outlet />;
};
