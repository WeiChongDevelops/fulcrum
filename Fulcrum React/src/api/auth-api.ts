import { consoleAuthError, supabaseClient } from "@/utility/supabase-client.ts";

//
// /**
//  * Attempts to register a new user with the provided email and password.
//  * Redirects to the login page on successful registration.
//  */
// export async function handleUserRegistration(email: string, password: string): Promise<void> {
//   try {
//     const response = await apiClient.post("/register", {
//       email: email,
//       password: password,
//     });
//     console.log(response.data);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new Error(`Error encountered when attempting user registration: ${error.message}`);
//     } else {
//       throw new Error("Unknown error encountered when attempting user registration.");
//     }
//   }
// }
//

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
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      consoleAuthError(error);
      throw new Error(error.message);
    }
    console.log({ loginSuccessfulFor: email });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when attempting login: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when attempting login.");
    }
  }
}
//
// /**
//  * Attempts to log in a user with the provided email and password.
//  * Redirects to the budget page on successful login.
//  * @param provider - The authentication provider
//  * @returns The url for OAuth
//  */
// export async function handleUserOAuthLoginPrompt(provider: string): Promise<string> {
//   try {
//     const response = await apiClient.post("/oAuthLoginPrompt", {
//       provider: provider,
//     });
//     console.log(response.data);
//     return response.data;
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new Error(`Error encountered when requesting oauth login: ${error.message}`);
//     } else {
//       throw new Error("Unknown error encountered when requesting oauth login.");
//     }
//   }
// }
//
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
//
// export async function handleUserOAuthInit(): Promise<void> {
//   try {
//     const response = await apiClient.post("/oAuthDataInitialisation");
//     console.log(response.data);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new Error(`Error encountered when requesting oauth init: ${error.message}`);
//     } else {
//       throw new Error("Unknown error encountered when requesting oauth init.");
//     }
//   }
// }
//
// /**
//  * Logs out the current user and redirects to the login page.
//  */
// export async function handleUserLogout(): Promise<void> {
//   try {
//     sessionStorage.clear();
//     await apiClient.post("/logout", {
//       jwt: localStorage.getItem("jwt"),
//     });
//     console.log("Logging out.");
//     window.location.href = "/login";
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new Error(`Error encountered when attempting logout: ${error.message}`);
//     } else {
//       throw new Error("Unknown error encountered when attempting logout.");
//     }
//   }
// }
//
