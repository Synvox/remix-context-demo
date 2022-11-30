import { LoaderArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { createLoader } from "~/getters/responseHelpers";
import { ensureLoggedIn } from "~/getters/getToken";
import { getUser } from "~/getters/getUser";
import { UserProvider } from "~/hooks/useUser";

export const loader = createLoader(async (req) => {
  await ensureLoggedIn(req);
  return json({ user: await getUser(req) });
});

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <UserProvider user={user}>
      <Outlet />
    </UserProvider>
  );
}
