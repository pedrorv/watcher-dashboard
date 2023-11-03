import { SERVER_HOST } from "@/config";

const AUTH_TOKEN_KEY = "auth-token";

export const getIsAuthorized = async (authToken: string): Promise<boolean> => {
  try {
    const res = await fetch(`${SERVER_HOST}/authorized`, {
      headers: { "auth-token": authToken },
    });

    return res.status === 200;
  } catch (e) {
    return false;
  }
};

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY) ?? "";
export const setAuthToken = (token: string) =>
  localStorage.setItem(AUTH_TOKEN_KEY, token);
