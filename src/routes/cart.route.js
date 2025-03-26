import { Router } from "express";
import * as cartController from '../controller/cart.controller.js'
import * as authMiddleWare from "../middleware/auth.middleware.js";


const cartRouter = Router();

cartRouter.post('/', authMiddleWare.verifyToken, cartController.add);
cartRouter.get('/', authMiddleWare.verifyToken, cartController.getCart);
cartRouter.put('/:id', authMiddleWare.verifyToken, cartController.updateQuantity);
cartRouter.delete('/:id', authMiddleWare.verifyToken, cartController.removeItem);



export default cartRouter;

