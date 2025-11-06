import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("email_campaigns", function (table) {
    table.increments("id").primary();
    table.string("subject", 500).notNullable();
    table.text("html_content").notNullable();
    table.text("text_content").nullable();
    table.string("recipient_type", 50).notNullable(); // 'all' or 'specific'
    table.text("recipient_ids").nullable(); // JSON array of user IDs for specific
    table.integer("total_recipients").notNullable();
    table.integer("success_count").defaultTo(0);
    table.integer("failure_count").defaultTo(0);
    table.text("results_summary").nullable(); // JSON summary of results
    table.enum("status", ["sending", "completed", "failed"]).defaultTo("sending");
    table.string("created_by", 50).nullable(); // Admin user ID
    table.timestamp("sent_at").nullable();
    table.timestamps(true, true);
  });

  await knex.raw(`
    CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);
    CREATE INDEX idx_email_campaigns_sent_at ON email_campaigns(sent_at);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("email_campaigns");
}

