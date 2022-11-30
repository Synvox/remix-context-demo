import { DataFunctionArgs } from "@remix-run/node";

type GetterFn<T> = (request: Request) => T;

const requestToContextWeakMap = new WeakMap<
  Request,
  DataFunctionArgs["context"]
>();

/**
 * This is a hack. It looks like the loader
 * request is cloned for each loader called.
 *
 * When a loader starts, we can snag the context
 * object and use that as a ref to re-associate
 * cloned requests.
 */
export function setRequestContext(
  request: Request,
  context: DataFunctionArgs["context"]
) {
  requestToContextWeakMap.set(request, context);
}

export function createGetter<T>(fn: GetterFn<T>) {
  let weakMap = new WeakMap<DataFunctionArgs["context"], T>();

  return Object.assign(
    function (request: Request) {
      const key = requestToContextWeakMap.get(request)!;
      if (weakMap.has(key)) {
        return weakMap.get(key)!;
      }

      let result = fn(request);
      weakMap.set(key, result);

      return result;
    },
    {
      revoke(request: Request) {
        const key = requestToContextWeakMap.get(request)!;
        return weakMap.delete(key);
      },
    }
  );
}
