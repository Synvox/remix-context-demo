import { DataFunctionArgs } from "@remix-run/node";

type GuardFn = (args: DataFunctionArgs) => void | Promise<void>;

export function createGuard(fn: GuardFn) {
  let weakMap = new WeakMap<DataFunctionArgs["context"], Promise<void>>();

  return function (args: DataFunctionArgs) {
    const key = args.context;
    if (weakMap.has(key)) {
      return weakMap.get(key)!;
    }

    let result = Promise.resolve(fn(args)).then(() => {});

    weakMap.set(key, result);

    return result;
  };
}
