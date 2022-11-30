import { redirect } from "@remix-run/node";
import cookie from "cookie";
import { read, create } from "~/jwt";
import knex from "~/knex";
import { createGetter } from "./createGetter";
import { getResponseHeaders } from "./responseHelpers";

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

export const getJwt = createGetter(async (req) => {
  const { [sessionCookieName]: jwt } = cookie.parse(
    req.headers.get("Cookie") ?? ""
  );

  const body = jwt ? await read<TokenBody>(jwt) : { userTokenId: undefined };

  return { jwt, body };
});

export const getToken = createGetter(async (req) => {
  const {
    body: { userTokenId },
  } = await getJwt(req);

  const loginRedirect = redirect("/login");

  if (!userTokenId) throw loginRedirect;

  const userToken = await knex<UserToken>("userTokens")
    .where("id", userTokenId)
    .whereNull("revokedAt")
    .first();

  if (!userToken) throw loginRedirect;

  return userToken;
});

export const renewToken = createGetter(async (req) => {
  const { body } = await getJwt(req);
  const { exp: _exp, iat: _iat, ...payload } = body;

  const headers = getResponseHeaders(req);

  headers.set(
    "Set-Cookie",
    cookie.serialize(
      sessionCookieName,
      await create({
        ...payload,
      })
    )
  );
});

export async function ensureLoggedIn(request: Request) {
  await getToken(request);
}

export async function ensureLoggedOut(request: Request) {
  try {
    await getToken(request);
  } catch (e) {
    if (!(e instanceof Response)) throw e;
    return;
  }

  throw redirect("/");
}

export async function newToken(userId: number) {
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
