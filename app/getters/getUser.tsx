import knex from "~/knex";
import { createGetter } from "./createGetter";
import { getToken } from "./getToken";

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export const getUser = createGetter(async (req) => {
  const token = await getToken(req);

  const user = await knex<User>("users").where("id", token.userId).first();

  return user!;
});

export async function getUserByEmail(email: string) {
  const user = await knex<User>("users").where("email", email).first();
  return user;
}
