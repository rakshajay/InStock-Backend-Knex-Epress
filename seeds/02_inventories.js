import inventoryData from '../seed-data/inventoryData.js'

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('inventories').del();
  await knex('inventories').insert(inventoryData);
};