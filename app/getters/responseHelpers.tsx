import {
  AppData,
  DataFunctionArgs,
  json,
  TypedResponse,
} from "@remix-run/node";
import { createGetter } from "./createGetter";

export const getResponseHeaders = createGetter((_req) => {
  return new Headers();
});

function createDataFunction<T>(
  fn: (args: DataFunctionArgs) => Promise<TypedResponse<T> | AppData>
) {
  return async function (args: DataFunctionArgs) {
    let result: TypedResponse<T> | undefined = undefined;

    try {
      result = await fn(args);
    } catch (e) {
      if (e instanceof Response) result = e;
      else throw e;
    }

    if (!(result instanceof Response)) result = json(result);

    const headers = getResponseHeaders(args);
    for (let [key, value] of result.headers) headers.set(key, value);

    return new Response(result.body, {
      status: result.status,
      statusText: result.statusText,
      headers,
    }) as TypedResponse<T>;
  };
}

export const createLoader = createDataFunction;
export const createAction = createDataFunction;
