import express from "express";
import { createUser, getAllUsers } from "../application/user.js";

const userRouter = express.Router();

userRouter.post("/", createUser).get("/", getAllUsers);

export default userRouter;
