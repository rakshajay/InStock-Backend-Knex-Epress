import warehouseData from '../seed-data/warehouseData.js'

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('warehouses').del();
  await knex('warehouses').insert(warehouseData);
};