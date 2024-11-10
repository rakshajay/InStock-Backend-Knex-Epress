import express from "express";
import * as wareController from "../controllers/warehouseControllers.js";

const warehousesRouter = express.Router();

warehousesRouter.route("/")
  .get(wareController.getWarehouses)
  .post(wareController.addWarehouse);

warehousesRouter.route("/:id")
  .patch(wareController.editWarehouse)
  .get(wareController.getWarehouse)
  .delete(wareController.deleteWarehouse);

warehousesRouter.route("/:id/inventories")
  .get(wareController.getItemsInWarehouse);

export default warehousesRouter;
