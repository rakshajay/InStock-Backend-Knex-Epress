import express from 'express';
import * as invController from '../controllers/inventoryControllers.js'

const inventoriesRouter = express.Router();

inventoriesRouter.route('/')
    .get(invController.getItems)
    .post(invController.postItem);

inventoriesRouter.route('/:id')
    .get(invController.getItem)
    .patch(invController.editItem)
    .delete(invController.deleteItem);

export default inventoriesRouter;