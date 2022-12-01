import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { createGuard } from "~/getters/createGuard";
import { ensureLoggedIn } from "~/getters/getToken";
import { getUser } from "~/getters/getUser";
import { createLoader } from "~/getters/responseHelpers";
import { UserProvider } from "~/hooks/useUser";

export const guard = createGuard(async (args) => {
  await ensureLoggedIn(args);
});

export const loader = createLoader(async (args) => {
  await guard(args);
  return json({ user: await getUser(args) });
});

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <UserProvider user={user}>
      <Outlet />
    </UserProvider>
  );
}
