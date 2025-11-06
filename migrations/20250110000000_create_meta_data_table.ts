import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('meta_data', (table) => {
    table.string('id', 20).primary();
    table.string('page', 255).unique().notNullable();
    table.string('title', 255).notNullable();
    table.text('description').notNullable();
    table.text('keywords').nullable();
    table.string('canonical', 500).notNullable();
    table.string('og_title', 255).nullable();
    table.text('og_description').nullable();
    table.string('og_image', 500).nullable();
    table.string('og_url', 500).nullable();
    table.string('og_type', 50).nullable().defaultTo('website');
    table.string('twitter_title', 255).nullable();
    table.text('twitter_description').nullable();
    table.string('twitter_image', 500).nullable();
    table.string('twitter_card', 50).nullable().defaultTo('summary_large_image');
    table.string('schema_type', 100).notNullable().defaultTo('WebPage');
    table.json('custom_schema').nullable();
    table.string('robots', 100).notNullable().defaultTo('index, follow');
    table.string('author', 255).nullable();
    table.timestamp('published_time').nullable();
    table.timestamp('modified_time').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meta_data');
}
