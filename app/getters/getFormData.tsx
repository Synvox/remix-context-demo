import { createGetter } from "./createGetter";

type GetFormData = <T extends string>(
  request: Request
) => Promise<Record<T, string | undefined>>;

export const getFormData: GetFormData = createGetter(async (req) => {
  const entries = [...(await req.formData()).entries()];

  const stringValueEntries = entries.map(([key, value]) => [
    key,
    String(value),
  ]);

  return Object.fromEntries(stringValueEntries);
});
