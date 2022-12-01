import { json, LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { ensureLoggedIn } from "~/getters/getToken";
import { getUser } from "~/getters/getUser";
import { UserProvider } from "~/hooks/useUser";

export async function loader(args: LoaderArgs) {
  await ensureLoggedIn(args);
  return json({ user: await getUser(args) });
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <UserProvider user={user}>
      <Outlet />
    </UserProvider>
  );
}
