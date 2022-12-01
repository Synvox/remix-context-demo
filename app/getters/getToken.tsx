import { DataFunctionArgs, redirect } from "@remix-run/node";
import cookie from "cookie";
import { create, read } from "~/jwt";
import knex from "~/knex";
import { createGetter } from "./createGetter";

const sessionCookieName = "SessionToken";

type TokenBody = {
  exp?: string;
  iat?: string;
  userTokenId?: string;
};

export type UserToken = {
  id: string;
  userId: number;
  issuedAt: string;
  revokedAt: string | null;
};

export const getJwt = createGetter(async ({ request }) => {
  const { [sessionCookieName]: jwt } = cookie.parse(
    request.headers.get("Cookie") ?? ""
  );

  const body = jwt ? await read<TokenBody>(jwt) : { userTokenId: undefined };

  return { jwt, body };
});

export const getToken = createGetter(async (args) => {
  const {
    body: { userTokenId },
  } = await getJwt(args);

  const loginRedirect = redirect("/login");

  if (!userTokenId) throw loginRedirect;

  const userToken = await knex<UserToken>("userTokens")
    .where("id", userTokenId)
    .whereNull("revokedAt")
    .first();

  if (!userToken) throw loginRedirect;

  return userToken;
});

export async function ensureLoggedIn(args: DataFunctionArgs) {
  await getToken(args);
}

export async function ensureLoggedOut(args: DataFunctionArgs) {
  try {
    await getToken(args);
  } catch (e) {
    if (!(e instanceof Response)) throw e;
    return;
  }

  throw redirect("/");
}

export async function newSessionCookie(userId: number) {
  const [userToken] = await knex("userTokens")
    .insert({ userId })
    .returning("*");

  return cookie.serialize(
    sessionCookieName,
    await create({
      userTokenId: userToken.id,
    })
  );
}
