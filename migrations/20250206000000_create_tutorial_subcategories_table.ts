import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tutorial_subcategories", (table) => {
    table.string("id", 10).primary();
    table.string("name", 255).notNullable().unique();
    table.string("slug", 255).notNullable().unique();
    table.text("description").nullable();
    table.string("icon", 255).nullable();
    table.string("color", 7).nullable(); // Hex color code
    table.integer("sort_order").notNullable().defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Indexes
    table.index(["slug"]);
    table.index(["name"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tutorial_subcategories");
}

