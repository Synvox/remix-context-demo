import {
  AppData,
  DataFunctionArgs,
  json,
  TypedResponse,
} from "@remix-run/node";
import { Params } from "@remix-run/react";
import { createGetter, setRequestContext } from "./createGetter";

export const getResponseHeaders = createGetter((_req) => {
  return new Headers();
});

const paramsWeakMap = new WeakMap<Request, Params>();

export function getParams(request: Request) {
  return paramsWeakMap.get(request)!;
}

function createDataFunction<T>(
  fn: (request: Request) => Promise<TypedResponse<T> | AppData>
) {
  return async function (args: DataFunctionArgs) {
    paramsWeakMap.set(args.request, args.params);
    setRequestContext(args.request, args.context);

    let result: TypedResponse<T> | undefined = undefined;

    try {
      result = await fn(args.request);
    } catch (e) {
      if (e instanceof Response) result = e;
      else throw e;
    }

    if (!(result instanceof Response)) result = json(result);

    const headers = getResponseHeaders(args.request);
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
