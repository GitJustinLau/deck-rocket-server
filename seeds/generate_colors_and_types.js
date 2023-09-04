// import seed data files, arrays of objects
const colorsData = require('../seed-data/colors-data');
const typesData = require('../seed-data/types-data');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('colors').del();
  await knex('types').del();
  await knex('colors').insert(colorsData);
  await knex('types').insert(typesData);
};