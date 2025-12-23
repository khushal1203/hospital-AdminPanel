import { User } from "@/modals/userModal";
import bcrypt from "bcryptjs";

export async function getUserController(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/**
 * Create a new user (Admin only)
 */
export const createUserController = async (body, adminRole, isAdminFlag) => {
  // Only admins can create users
  if (adminRole !== "admin" && !isAdminFlag) {
    throw new Error("Unauthorized: Only administrators can create users");
  }

  const { fullName, email, password, role } = body;

  // Validate input
  if (!fullName || !email || !password || !role) {
    throw new Error("All fields are required");
  }

  // Validate role
  const validRoles = ["admin", "receptionist", "doctor", "laboratory"];
  if (!validRoles.includes(role)) {
    throw new Error("Invalid role");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user - only admin role gets isAdmin: true
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role,
    isAdmin: role === "admin",
  });

  return {
    success: true,
    message: "User created successfully",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
    },
  };
};

/**
 * Get all users (Admin only)
 */
export const getAllUsersController = async (adminRole, isAdminFlag) => {
  // Only admins can view all users
  if (adminRole !== "admin" && !isAdminFlag) {
    throw new Error("Unauthorized: Only administrators can view users");
  }

  const users = await User.find().select("-password").sort({ createdAt: -1 });

  return {
    success: true,
    users,
  };
};

/**
 * Delete a user (Admin only)
 */
export const deleteUserController = async (userId, adminRole, isAdminFlag) => {
  // Only admins can delete users
  if (adminRole !== "admin" && !isAdminFlag) {
    throw new Error("Unauthorized: Only administrators can delete users");
  }

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    success: true,
    message: "User deleted successfully",
  };
};
