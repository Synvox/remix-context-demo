import { createGetter } from "./createGetter";

type GetQueryParams = <T extends string>(
  request: Request
) => Promise<Record<T, string | undefined>>;

export const getQueryParams: GetQueryParams = createGetter(async (req) => {
  const entries = [...new URL(req.url).searchParams.entries()];

  const stringValueEntries = entries.map(([key, value]) => [
    key,
    String(value),
  ]);

  return Object.fromEntries(stringValueEntries);
});
