import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tutorials", (table) => {
    table.string("id", 10).primary();
    table.string("title", 255).notNullable().unique();
    table.text("description").nullable();
    table.text("content").nullable();
    table.string("image_url", 500).nullable();
    table.string("slug", 255).notNullable().unique();
    table.string("author_id", 10).notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("subcategory_id", 10).notNullable().references("id").inTable("tutorial_subcategories").onDelete("CASCADE");
    table.enum("status", ["DRAFT", "PUBLISHED", "REJECTED"]).notNullable().defaultTo("DRAFT");
    table.integer("view_count").notNullable().defaultTo(0);
    table.enum("difficulty", ["BEGINNER", "INTERMEDIATE", "ADVANCED"]).nullable();
    table.integer("estimated_time").nullable().comment("Time in minutes");
    table.timestamp("published_at").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Indexes
    table.index(["slug"]);
    table.index(["author_id"]);
    table.index(["subcategory_id"]);
    table.index(["status"]);
    table.index(["published_at"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tutorials");
}

