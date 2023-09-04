/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id').primary().comment('Primary Key')
            table.string('username', 50).notNullable();
            table.string('password', 255).notNullable();
            table.string('email', 50).notNullable();
        })
        .createTable('types', function (table) {
            table.increments('id').primary().comment('Primary Key')
            table.string('name', 50).notNullable();
        })
        .createTable('colors', function (table) {
            table.increments('id').primary().comment('Primary Key')
            table.string('name', 50).notNullable();
        })
        .createTable('cards', function (table) {
            table.string('id', 255).primary().comment('Primary Key')
            table.string('name', 255).notNullable();
            table.string('manaCost', 50).defaultTo(null);
            table.string('cmc', 50).defaultTo(null);
            table.string('imageUrl', 255).defaultTo(null);
            table.string('power', 50).defaultTo(null);
            table.string('toughness', 50).defaultTo(null);
            table.string('text', 2047).defaultTo(null);
        })
        .createTable('decklists', function (table) {
            table.integer('id').primary().comment('Primary Key')
            table.string('name', 255).notNullable();
            table.integer('user_id')
                .references("user.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.boolean('is_deleted').defaultTo(0);
        })
        .createTable('decklist_cards', function (table) {
            table.integer('id').primary().comment('Primary Key')
            table.integer('decklist_id').notNullable()
                .references("decklists.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.string('card_id', 255).notNullable()
                .references("cards.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
        })
        .createTable('card_color_ids', function (table) {
            table.string('card_id', 255)
                .notNullable()
                .references("cards.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.integer('color_id')
                .notNullable()
                .references("colors.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.primary(['card_id', 'color_id']);
        })
        .createTable('card_types', function (table) {
            table.string('card_id', 255)
                .notNullable()
                .references("cards.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.integer('type_id')
                .notNullable()
                .references("types.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.primary(['card_id', 'type_id']);
        })
    }

    exports.down = function(knex) {
        return knex.schema
          .dropTableIfExists('card_types')
          .dropTableIfExists('card_color_ids')
          .dropTableIfExists('decklist_cards')
          .dropTableIfExists('decklists')
          .dropTableIfExists('cards')
          .dropTableIfExists('colors')
          .dropTableIfExists('types')
          .dropTableIfExists('users');
      };
      

