import { LoaderArgs } from "@remix-run/node";
import { ensureLoggedIn } from "~/getters/getToken";
import { useUser } from "~/hooks/useUser";

export async function loader(args: LoaderArgs) {
  await ensureLoggedIn(args);
  return null;
}

export default function SubRouteIndex() {
  const user = useUser();

  return <div>Welcome {user.email}</div>;
}
