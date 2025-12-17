import { User } from "@/modals/userModal";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    validateSignIn,
    validateSignUp
} from "@/validation/auth-validation";

/* ================= SIGN IN ================= */
export const signInController = async (body) => {
    const { email, password } = body;

    validateSignIn(body);

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Wrong password");

    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {
        token,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        }
    };
};

/* ================= SIGN UP ================= */
export const signUpController = async (body) => {
    const { fullName, email, password } = body;

    validateSignUp(body);

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword
    });

    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {
        token,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        }
    };
};
