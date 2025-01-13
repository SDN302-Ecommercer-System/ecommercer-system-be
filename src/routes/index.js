import { Router } from "express";
import userRoute from "./user.route.js";

const mainRoute = Router();

mainRoute.use("/user", userRoute);

export default mainRoute;