import { DataFunctionArgs } from "@remix-run/node";
import { createGetter } from "./createGetter";

type GetFormData = <T extends string>(
  args: DataFunctionArgs
) => Promise<Record<T, string | undefined>>;

export const getFormData: GetFormData = createGetter(async ({ request }) => {
  const entries = [...(await request.formData()).entries()];

  const stringValueEntries = entries.map(([key, value]) => [
    key,
    String(value),
  ]);

  return Object.fromEntries(stringValueEntries);
});
