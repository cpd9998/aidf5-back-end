import express from "express";
import { getHash, notify } from "../application/payment";
import isAuthenticated from "./middleware/authentication-middleware";

const paymentRouter = express.Router();

paymentRouter.post("/start", isAuthenticated, getHash);

paymentRouter.post("/notify", isAuthenticated, notify);

export default paymentRouter;
