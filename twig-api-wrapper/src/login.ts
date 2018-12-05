import * as rp from "request-promise-native";
import { config } from "./config";
import { rpOptions } from "./rpOptions";

/**
 * Used to login to twig-api and set the cookie needed for future requests. Only needs to be called
 * once.
 *
 * @export
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} API currently responds with OK
 */
export function login(email: string, password: string): Promise<string> {
  return rp(rpOptions("POST", `${config.apiUrl}/login`, { email, password }));
}
