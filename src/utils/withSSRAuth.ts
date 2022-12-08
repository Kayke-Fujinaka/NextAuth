import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AUTH_REFRESH_TOKEN, AUTH_TOKEN } from "../constants";
import { AuthTokenError } from "../errors/AuthTokenError";

export function withSSRAuth<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    const hasCookies = cookies[AUTH_TOKEN];

    if (!hasCookies) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    try {
      return await fn(ctx);
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, AUTH_TOKEN);
        destroyCookie(ctx, AUTH_REFRESH_TOKEN);

        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }

      return {
        redirect: {
          destination: `/`,
          permanent: false,
        },
      };
    }
  };
}
