import axios, { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import { parseCookies, setCookie } from "nookies";
import {
  AUTH_REFRESH_TOKEN,
  AUTH_TOKEN,
  ERROR_TOKEN_EXPIRED,
} from "../constants";
import { signOut } from "../contexts/AuthContext";

interface AxiosErrorResponse {
  code?: string;
}

type Context = undefined | GetServerSidePropsContext;

let isRefreshing = false;
let failedRequestQueue = [];

export function setupAPIClient(ctx: Context = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
      Authorization: `Bearer ${cookies[AUTH_TOKEN]}`,
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError<AxiosErrorResponse>) => {
      if (error.response.status === 401) {
        if (error.response.data?.code === ERROR_TOKEN_EXPIRED) {
          cookies = parseCookies(ctx);

          const { AUTH_REFRESH_TOKEN: refreshToken } = cookies;

          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            api
              .post("/refresh", {
                refreshToken,
              })
              .then((response) => {
                const { token } = response.data;

                setCookie(ctx, AUTH_TOKEN, token, {
                  maxAge: 60 * 60 * 25 * 30, // 30 days
                  path: "/",
                });

                setCookie(ctx, AUTH_REFRESH_TOKEN, response.data.refreshToken, {
                  maxAge: 60 * 60 * 25 * 30, // 30 days
                  path: "/",
                });

                api.defaults.headers["Authorization"] = `Bearer ${token}`;

                failedRequestQueue.forEach((request) =>
                  request.onSuccess(token)
                );
                failedRequestQueue = [];
              })
              .catch((err: AxiosError) => {
                failedRequestQueue.forEach((request) => request.onFailure(err));
                failedRequestQueue = [];

                if (process.browser) {
                  signOut();
                }
              })
              .finally(() => {
                isRefreshing = false;
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers["Authorization"] = `Beare ${token}`;

                resolve(api(originalConfig));
              },
              onFailure: (error: AxiosError) => {
                reject(error);
              },
            });
          });
        } else {
          signOut();
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}

export const api = setupAPIClient();
