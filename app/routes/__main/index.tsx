import { createLoader } from "~/getters/responseHelpers";
import { useUser } from "~/hooks/useUser";
import { guard } from "../__main";

export const loader = createLoader(async (args) => {
  await guard(args); // maybe handled by the framework
  return null;
});

export default function SubRouteIndex() {
  const user = useUser();

  return <div>{user.email}</div>;
}
