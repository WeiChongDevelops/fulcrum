import { consoleAuthError, consolePostgrestError, getActiveUserId, supabaseClient } from "@/utility/supabase-client.ts";
import { GroupItemEntity } from "@/utility/types.ts";
import {
  initialiseDefaultCategories,
  initialiseDefaultGroups,
  initialiseDefaultIncome,
  initialiseDefaultUserPreferences,
  rowsExistFor,
} from "@/api/init-api.ts";

/**
 * Attempts to register a new user with the provided email and password.
 * Redirects to the login page on successful registration.
 */
export async function handleUserRegistrationDirect(email: string, password: string): Promise<void> {
  try {
    // const response = await apiClient.post("/register", {
    //   email: email,
    //   password: password,
    // });
    // console.log(response.data);
    const { data, error: signupError } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    if (signupError) {
      consoleAuthError(signupError);
      throw new Error(signupError.message);
    }

    await initialiseDefaultUserPreferences();
    await initialiseDefaultIncome();
    await initialiseDefaultGroups();
    await initialiseDefaultCategories();

    const { error: logoutError } = await supabaseClient.auth.signOut();
    if (logoutError) {
      consoleAuthError(logoutError);
      throw new Error(logoutError.message);
    }

    console.log({ registrationSuccessfulFor: data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when attempting user registration: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when attempting user registration.");
    }
  }
}

/**
 * Attempts to log in a user with the provided email and password.
 * Redirects to the budget page on successful login.
 */
export async function handleUserLoginDirect(email: string, password: string): Promise<void> {
  try {
    // const response = await apiClient.post("/login", {
    //   email: email,
    //   password: password,
    // });
    // console.log(response.data);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      consoleAuthError(error);
      throw new Error(error.message);
    }
    console.log({ loginSuccessfulFor: data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when attempting login: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when attempting login.");
    }
  }
}

/**
 * Attempts to log in a user with the provided email and password.
 * Redirects to the budget page on successful login.
 * @param provider - The authentication provider
 * @returns The url for OAuth
 */
export async function getOAuthLoginURLDirect(provider: string): Promise<string> {
  try {
    if (provider === "facebook") {
      return "/whatintheworldwereyouthinkingmark";
    }
    if (provider !== "google") {
      throw new Error("OAuth provider not recognised.");
    }
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://fulcrumfinance.app/oAuthSuccess" },
    });
    if (error) {
      consoleAuthError(error);
      throw new Error(error.message);
    }
    if (data === null || data.url === null) {
      throw new Error("Redirect URL not received.");
    }
    const user = await supabaseClient.auth.getUser();
    console.log({ fullUserObject: user.data });
    console.log({ oAuthAvatarURL: user.data.user?.user_metadata.avatar_url });
    return data.url;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting OAuth login: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting OAuth login.");
    }
  }
}

// /**
//  * Attempts to log in a user with the provided email and password.
//  * Redirects to the budget page on successful login.
//  */
// export async function handleUserOAuthLoginAttempt(accessToken: string, refreshToken: string): Promise<void> {
//   try {
//     const response = await apiClient.post("/oAuthLoginAttempt", {
//       accessToken: accessToken,
//       refreshToken: refreshToken,
//     });
//     console.log(response.data);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new Error(`Error encountered when attempting oauth login: ${error.message}`);
//     } else {
//       throw new Error("Unknown error encountered when attempting oauth login.");
//     }
//   }
// }

export async function handleUserOAuthInitDirect(): Promise<void> {
  try {
    const firstLogin = !(await rowsExistFor("user_preferences"));
    if (firstLogin) {
      await initialiseDefaultUserPreferences();
      await initialiseDefaultIncome();
      await initialiseDefaultGroups();
      await initialiseDefaultCategories();
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting oauth init: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting oauth init.");
    }
  }
}

/**
 * Logs out the current user and redirects to the login page.
 */
export async function handleUserLogoutDirect(): Promise<void> {
  try {
    sessionStorage.clear();
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      consoleAuthError(error);
      throw new Error(error.message);
    }
    console.log("Logging out.");
    window.location.href = "/login";
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when attempting logout: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when attempting logout.");
    }
  }
}
