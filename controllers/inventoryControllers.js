import initKnex from 'knex';
import config from '../knexfile.js';

const knex = initKnex(config);

const postItem = async (req, res) => {
    try {
        const foundWarehouse = await knex("warehouses").where({id: req.body.warehouse_id})
        if(foundWarehouse.length === 0) {
            return res.status(400)
                .send(`Warehouse with id: ${req.params.id} does not exist`);
        }
        if (!req.body.warehouse_id ||
            !req.body.item_name ||
            !req.body.description ||
            !req.body.category ||
            !req.body.status ||
            !req.body.quantity
        ) {
        return res.status(400)
            .send("Please make sure all fields are filled in");
        }
        if(typeof(req.body.quantity) != "number"){
            return res.status(400)
                .send("Quantity inputted must be a number");
        }
        const result = await knex("inventories")
        .insert(req.body);

        const newProductId = result[0];
        const createdProduct = await knex("inventories")
        .where({id: newProductId});

        res.status(201).json(createdProduct);

    } catch (error) {
        res.status(500)
            .send(`Unable to create new inventory item: ${error}`, error);
    }
}

const editItem = async (req,res) => {
    try{
        const foundItem = await knex("inventories").where({id: req.params.id})
        if(foundItem.length === 0) {
            return res.status(404)
                .send(`Inventory item with id: ${req.params.id} does not exist`);
        }
        const foundWarehouse = await knex("warehouses").where({id: req.body.warehouse_id})
        if(foundWarehouse.length === 0) {
            return res.status(400)
                .send(`Error retrieving Warehouse with id: ${req.body.warehouse_id}.`, error)
        }
        if (!req.body.warehouse_id ||
            !req.body.item_name ||
            !req.body.description ||
            !req.body.category ||
            !req.body.status ||
            !req.body.quantity
        ) {
        return res.status(400)
            .send("Please make sure all fields are filled in");
        }
        if(typeof(req.body.quantity) != "number"){
            return res.status(400)
                .send("Quantity inputted must be a number");
        }
        const updatedItem = await knex("inventories")
            .where({id: req.params.id})
            .update(req.body)       
        
        res.status(200).json(updatedItem[0]);

    }catch (error) {
        res.status(500)
            .send(`Unable to edit inventory item:`, error);
    }
}

const getItems = async (req, res) => {
    try {
        const inventoryData = await knex("inventories")
        .select('inventories.id', 'warehouse_name', 'warehouse_id', 'item_name', 'description', 'category', 'status', 'quantity')
        .innerJoin('warehouses','inventories.warehouse_id', 'warehouses.id')
        res.status(200).json(inventoryData);
    } catch (error) {
        res.status(400)
            .send(`Error retrieving inventory:`, error)
    }
}

const getItem = async (req, res) =>{
    try {
        const itemData = await knex("inventories")
        .select('inventories.id', 'warehouse_name', 'warehouse_id', 'item_name', 'description', 'category', 'status', 'quantity')
        .innerJoin('warehouses','inventories.warehouse_id', 'warehouses.id')
        .where('inventories.id', req.params.id);
        const foundItem = itemData[0];

        if(!foundItem){
            return res.status(404)
                .send(`Inventory item with id: ${req.params.id} does not exist`);
        }
        res.status(200).json(itemData[0]);
        
    } catch (error) {
        res.status(400)
            .send(`Error retrieving Item with id: ${req.params.id}.`, error)
    }
}

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        const inventoryItem = await knex('inventories').where('id', id).first();
        if (!inventoryItem) {return res.status(404).send("Inventory item not found");}

        await knex('inventories').where('id', id).del();

        res.status(204).send("successfully deleted");
    } catch (error) {
        res.status(500).send(`Error deleting inventory item with id: ${id}. ${error.message}`);
    }
};

export {
    postItem,
    getItems,
    getItem,
    editItem,
    deleteItem
    //posts,

};