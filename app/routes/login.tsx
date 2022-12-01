import { json, LoaderArgs, redirect } from "@remix-run/node";
import { getFormData } from "~/getters/getFormData";
import {
  ensureLoggedOut,
  newSessionCookie as createSessionCookie,
} from "~/getters/getToken";
import { getUserByEmail } from "~/getters/getUser";

export async function loader(args: LoaderArgs) {
  await ensureLoggedOut(args);

  return null;
}

export async function action(args: LoaderArgs) {
  await ensureLoggedOut(args);

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
      "Set-Cookie": await createSessionCookie(user.id),
    },
  });
}

export default function LoginRoute() {
  return (
    <form method="post">
      <input name="email" />
      <button>Submit</button>
    </form>
  );
}
