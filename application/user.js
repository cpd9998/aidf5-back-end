import e from "express";
import User from "../infrastructure/entities/User.js";
export const createUser = async (req, res) => {
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
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.create(userData);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

export const updateUser = async (req, res) => {
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
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findByIdAndUpdate(userId, userData);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};
