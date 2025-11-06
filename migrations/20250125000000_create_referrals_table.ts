import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Create referrals table
  await knex.schema.createTable('referrals', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.enum('category', ['hosting', 'tools', 'finance', 'marketing', 'education', 'other']).notNullable();
    table.string('company').notNullable();
    table.text('referral_url').notNullable();
    table.text('original_url').notNullable();
    table.string('discount').nullable();
    table.string('bonus').nullable();
    table.string('image_url').nullable();
    table.string('logo_url').nullable();
    table.json('features').nullable(); // Array of strings
    table.json('pros').nullable(); // Array of strings
    table.json('cons').nullable(); // Array of strings
    table.decimal('rating', 2, 1).notNullable().defaultTo(0); // 1-5 rating
    table.enum('price_range', ['free', 'budget', 'mid-range', 'premium']).notNullable();
    table.json('target_audience').nullable(); // Array of strings
    table.text('use_case').nullable();
    table.text('personal_experience').nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.boolean('is_featured').notNullable().defaultTo(false);
    table.integer('priority').notNullable().defaultTo(0);
    table.integer('click_count').notNullable().defaultTo(0);
    table.integer('conversion_count').notNullable().defaultTo(0);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    
    // Indexes for better performance
    table.index(['category']);
    table.index(['is_active']);
    table.index(['is_featured']);
    table.index(['priority']);
    table.index(['created_at']);
  });

  // Create referral_clicks table for tracking
  await knex.schema.createTable('referral_clicks', (table) => {
    table.string('id').primary();
    table.string('referral_id').notNullable();
    table.string('user_id').nullable();
    table.string('session_id').notNullable();
    table.string('ip_address').notNullable();
    table.text('user_agent').notNullable();
    table.text('referrer').nullable();
    table.timestamp('clicked_at').notNullable().defaultTo(knex.fn.now());
    table.boolean('converted').notNullable().defaultTo(false);
    table.decimal('conversion_value', 10, 2).nullable();
    
    // Foreign key constraint
    table.foreign('referral_id').references('id').inTable('referrals').onDelete('CASCADE');
    
    // Indexes
    table.index(['referral_id']);
    table.index(['user_id']);
    table.index(['session_id']);
    table.index(['clicked_at']);
    table.index(['converted']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('referral_clicks');
  await knex.schema.dropTable('referrals');
}
