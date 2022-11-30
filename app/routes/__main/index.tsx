import { ensureLoggedIn } from "~/getters/getToken";
import { createLoader } from "~/getters/responseHelpers";
import { useUser } from "~/hooks/useUser";

export const loader = createLoader(async (args) => {
  await ensureLoggedIn(args);
  return null;
});

export default function SubRouteIndex() {
  const user = useUser();

  return <div>{user.email}</div>;
}
