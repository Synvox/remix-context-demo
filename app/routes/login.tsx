import { json, redirect } from "@remix-run/node";
import { createGuard } from "~/getters/createGuard";
import { getFormData } from "~/getters/getFormData";
import { ensureLoggedOut, newToken } from "~/getters/getToken";
import { getUserByEmail } from "~/getters/getUser";
import { createLoader } from "~/getters/responseHelpers";

export const guard = createGuard(async (args) => {
  await ensureLoggedOut(args);
});

export const loader = createLoader(async (args) => {
  await guard(args);

  return null;
});

export const action = createLoader(async (args) => {
  await guard(args);

  const { email = "" } = await getFormData<"email">(args);
  const user = await getUserByEmail(email);

  if (!user) {
    throw json(
      {
        errors: { email: "not found" },
      },
      { status: 404 }
    );
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await newToken(user.id),
    },
  });
});

export default function LoginRoute() {
  return (
    <form method="post">
      <input name="email" />
      <button>Submit</button>
    </form>
  );
}
