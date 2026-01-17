import { Request, Response } from "express";
import { User, UserRole } from "../model/user";
import { connectDB } from "../db/config";

export const getAllUser = async (req: Request, res: Response) => {
  try {
    await connectDB();

    const users = await User.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { userId } = req.params;
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
        allowedRoles: Object.values(UserRole),
      });
    }

    if (userId === req.user._id) {
      return res.status(403).json({
        success: false,
        message: "Cannot change your own role",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        role,
      },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};
