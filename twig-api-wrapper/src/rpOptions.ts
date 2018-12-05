import { omit } from "ramda";
import * as request from "request";
import { jar, OptionsWithUri } from "request-promise-native";
export const cookieJar = jar();

export function rpOptions(method: Method, uri: string, body?: any): OptionsWithUri {
  const returner = {
    body,
    jar: cookieJar,
    json: true,
    method,
    uri,
    transform(response: string) {
      try {
        return JSON.parse(response);
      } catch (error) {
        return response;
      }
    },
  };
  if (method === "GET" || method === "DELETE") {
    return omit(["body"], returner);
  }
  return returner;
}

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
