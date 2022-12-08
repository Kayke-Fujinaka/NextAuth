import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { AUTH_REFRESH_TOKEN, AUTH_TOKEN } from "../constants";
import { api } from "../services/api";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticaded: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, AUTH_TOKEN);
  destroyCookie(undefined, AUTH_REFRESH_TOKEN);

  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const isAuthenticaded = !!user;

  useEffect(() => {
    const { AUTH_TOKEN: token } = parseCookies();

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { email, permissions, roles } = response.data;

          setUser({ email, permissions, roles });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("sessions", { email, password });

      const { token, refreshToken, permissions, roles } = response.data;

      setUser({ email, permissions, roles });

      setCookie(undefined, AUTH_TOKEN, token, {
        maxAge: 60 * 60 * 25 * 30, // 30 days
        path: "/",
      });

      setCookie(undefined, AUTH_REFRESH_TOKEN, refreshToken, {
        maxAge: 60 * 60 * 25 * 30, // 30 days
        path: "/",
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticaded, user }}>
      {children}
    </AuthContext.Provider>
  );
}
