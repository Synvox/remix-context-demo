import { DataFunctionArgs } from "@remix-run/node";
import { createGetter } from "./createGetter";

type GetQueryParams = <T extends string>(
  args: DataFunctionArgs
) => Promise<Record<T, string | undefined>>;

export const getQueryParams: GetQueryParams = createGetter(
  async ({ request }) => {
    const entries = [...new URL(request.url).searchParams.entries()];

    const stringValueEntries = entries.map(([key, value]) => [
      key,
      String(value),
    ]);

    return Object.fromEntries(stringValueEntries);
  }
);
