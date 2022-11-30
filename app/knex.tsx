import connect, { Knex } from "knex";
import pg from "pg";
import knexfile from "../knexfile";

pg.types.setTypeParser(20, "text", (x) => {
  return Number(x);
});

const knexHelpers = {
  wrapIdentifier: (value: string) => toSnakeCase(value),
  postProcessResponse: (value: string) => transformKeys(value, toCamelCase),
};

function transformKeys(obj: any, method: (word: string) => string): any {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map((item) => transformKeys(item, method));

  if (obj instanceof Date) return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      method(key),
      transformKeys(value, method),
    ])
  );
}

const toCamelCase = (str: string = "") =>
  str.replace(/(?<!_)(_([^_]))/g, (_1, _2, r) => r.toUpperCase());

const toSnakeCase = (str: string = "") =>
  str.replace(/[a-z0-9]([A-Z])[A-Z]*/g, (str) => {
    const [a, b] = str.split("");
    return `${a}_${b.toLowerCase()}`;
  });

const knex: Knex<any, unknown[]> =
  //@ts-expect-error
  global.knex ??
  connect({
    ...(knexfile as any)[process.env.NODE_ENV || "development"],
    ...knexHelpers,
  });

//@ts-expect-error
global.knex = knex;

export default knex;
