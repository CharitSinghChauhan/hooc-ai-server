import { Request, Response } from "express";
import { oauth2client } from "../utils/google-config";
import axios from "axios";
import { User, UserRole } from "../model/user";
import jwt, { SignOptions } from "jsonwebtoken";
import { connectDB } from "../db/config";

export const googleLogin = async (req: Request, res: Response) => {
  try {
    await connectDB();

    const { code } = req.query;

    if (!code) throw new Error("Google code is required");

    const { tokens } = await oauth2client.getToken(code as string);

    if (!tokens?.access_token || !tokens?.id_token) {
      throw new Error("Invalid Google OAuth response");
    }
    oauth2client.setCredentials(tokens);

    const ticket = await oauth2client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.email_verified) {
      throw new Error("Unverified Google account");
    }

    const { data } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    );

    const { email, name, picture } = data;

    console.log(`pic: ${picture}`);

    let user = await User.findOne({
      email,
    });

    if (!user) {
      const role =
        email === process.env.SUPER_ADMIN
          ? UserRole.SUPER_ADMIN
          : UserRole.USER;

      user = await User.create({
        name,
        email,
        picture,
        role,
      });
    }

    const { _id } = user;

    const token = jwt.sign(
      {
        _id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
      },
    );

    return res.status(200).json({
      message: "Authentication successful",
      token,
      user,
    });
  } catch (error: any) {
    console.error(
      "Error in googleLogin:",
      error?.response?.data || error.message,
    );
    return res.status(500).json({
      message: "Authentication failed",
      error: error?.response?.data || error.message,
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {

    await connectDB();

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};
