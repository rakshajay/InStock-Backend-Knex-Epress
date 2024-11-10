import initKnex from "knex";
import config from "../knexfile.js";

const knex = initKnex(config);

const getWarehouses = async (req, res) => {
  try {
    const warehousesData = await knex("warehouses");
    res.status(200).json(warehousesData);
  } catch (error) {
    res.status(400)
      .send(`Error retrieving Warehouses:`, error);
  }
};

const getWarehouse = async (req, res) => {
  try {
    const warehouseData = await knex("warehouses").where("id", req.params.id);
    if (!warehouseData[0]){
      res.status(404)
        .send(`Warehouse with id: ${req.params.id} does not exist`);
    }
    res.status(200).json(warehouseData[0]);
  } catch (error) {
    res.status(400)
      .send(`Error retrieving Warehouse with id: ${req.params.id}`, error);
  }
};

const addWarehouse = async (req, res) => {
  if (
    !req.body.warehouse_name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contact_name ||
    !req.body.contact_position ||
    !req.body.contact_phone ||
    !req.body.contact_email
  ) {
    return res.status(400)
      .send("Please make sure all fields are filled in");
  }
  try {
    const warehouse = await knex("warehouses").insert(req.body);
    const newWarehouseId = warehouse[0];
    const createdWarehouse = await knex("warehouses").where({
      id: newWarehouseId,
    });
    res.status(200).json(createdWarehouse);
  } catch (error) {
    res.status(500)
      .send(`Error adding Warehouse`, error);
  }
};

const editWarehouse = async (req, res) => {
  try {
    const rowsUpdated = await knex("warehouses")
      .where({id: req.params.id})
      .update(req.body);
    if (rowsUpdated === 0) {
      return res.status(404)
        .send(`Warehouse with ID ${req.params.id} not found` );
    };
    const updatedWarehouse = await knex("warehouses")
      .where({id: req.params.id});

    res.json(updatedWarehouse[0]);
  } catch (error) {
    res.status(500)
      .send(`Error updating warehouse with id: ${req.params.id}:`, error);
  }
};

const getItemsInWarehouse = async (req, res) => {
  try {
    const inventoriesData = await knex("inventories")
      .select(
        "inventories.id",
        "warehouse_name",
        "item_name",
        "description",
        "category",
        "status",
        "quantity"
      )
      .innerJoin("warehouses", "inventories.warehouse_id", "warehouses.id")
      .where("warehouse_id", req.params.id);

    res.status(200).json(inventoriesData);
  } catch (error) {
    res.status(400)
      .send(`Error retrieving inventory for Warehouse with id: ${req.params.id}.`, error);
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await knex("warehouses")
      .where("id", req.params.id)
      .first();
    if (!warehouse) {
      return res.status(404).send(`Warehouse with id: ${req.params.id} not found`);
    }

    await knex("inventories").where("warehouse_id", req.params.id).del();
    await knex("warehouses").where("id", req.params.id).del();

    res.status(204).send("warehouse deleted");
  } catch (error) {
    res.status(500)
      .send(`Error deleting warehouse with id: ${req.params.id}:`, error);
  }
};

export {
  getWarehouses,
  getWarehouse,
  addWarehouse,
  getItemsInWarehouse,
  deleteWarehouse,
  editWarehouse,
};
