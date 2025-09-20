import e from "express";
import User from "../infrastructure/entities/User";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "../api/domain/errors/index";
import { Request, Response, NextFunction } from "express";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.body;
    if (
      !userData.fname ||
      !userData.lname ||
      !userData.email ||
      !userData.address.line_1 ||
      !userData.address.line_2 ||
      !userData.address.city ||
      !userData.address.country ||
      !userData.address.zip
    ) {
      throw new ValidationError("Missing required fields");
    }
    const user = await User.create(userData);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const userData = req.body;
    if (
      !userData.fname ||
      !userData.lname ||
      !userData.email ||
      !userData.address.line_1 ||
      !userData.address.line_2 ||
      !userData.address.city ||
      !userData.address.country ||
      !userData.address.zip
    ) {
      throw new ValidationError("Missing required fields");
    }
    const user = await User.findByIdAndUpdate(userId, userData);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
