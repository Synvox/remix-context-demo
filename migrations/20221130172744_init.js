/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw("create extension if not exists citext");
  await knex.schema
    .createTable("users", (t) => {
      t.bigIncrements("id").primary();
      t.specificType("email", "citext").unique().notNullable();
      t.text("first_name").notNullable();
      t.text("last_name").notNullable();
      t.text("password_hash").notNullable();
      t.check("email <> '' and trim(email) = email");
    })
    .createTable("user_tokens", (t) => {
      t.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      t.bigInteger("user_id")
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("cascade")
        .onDelete("cascade");
      t.timestamp("issued_at").notNullable().defaultTo(knex.raw("now()"));
      t.timestamp("revoked_at");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("user_tokens").dropTable("users");
};
