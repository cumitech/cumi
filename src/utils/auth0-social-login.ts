import { signIn } from "next-auth/react";

/**
 * Auth0 Social Login Utility
 * Handles direct social provider authentication through Auth0
 */
export const auth0SocialLogin = {
  /**
   * Sign in with Google through Auth0
   */
  google: () => {
    signIn("auth0", {
      callbackUrl: "/",
      redirect: true,
      authorizationParams: {
        connection: "google-oauth2"
      }
    });
  },

  /**
   * Sign in with Facebook through Auth0
   */
  facebook: () => {
    signIn("auth0", {
      callbackUrl: "/",
      redirect: true,
      authorizationParams: {
        connection: "facebook"
      }
    });
  },

  /**
   * Sign in with Twitter through Auth0
   */
  twitter: () => {
    signIn("auth0", {
      callbackUrl: "/",
      redirect: true,
      authorizationParams: {
        connection: "twitter"
      }
    });
  },

  /**
   * Sign in with GitHub through Auth0
   */
  github: () => {
    signIn("auth0", {
      callbackUrl: "/",
      redirect: true,
      authorizationParams: {
        connection: "github"
      }
    });
  },

  /**
   * Sign in with LinkedIn through Auth0
   */
  linkedin: () => {
    signIn("auth0", {
      callbackUrl: "/",
      redirect: true,
      authorizationParams: {
        connection: "linkedin"
      }
    });
  },

  /**
   * Sign in with Microsoft through Auth0
   */
  microsoft: () => {
    signIn("auth0", {
      callbackUrl: "/",
      redirect: true,
      authorizationParams: {
        connection: "windowslive"
      }
    });
  },

  /**
   * Sign in with Apple through Auth0
   */
  apple: () => {
    signIn("auth0", {
      callbackUrl: "/",
      redirect: true,
      authorizationParams: {
        connection: "apple"
      }
    });
  },

  /**
   * Generic method to sign in with any Auth0 connection
   */
  withConnection: (connection: string) => {
    signIn("auth0", {
      callbackUrl: "/",
      redirect: true,
      authorizationParams: {
        connection
      }
    });
  }
};

export default auth0SocialLogin;

