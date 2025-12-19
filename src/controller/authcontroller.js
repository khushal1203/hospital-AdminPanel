import { User } from "@/modals/userModal";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "@/lib/nodemailer";

// Inline validation functions
const validateSignIn = (body) => {
    const { email, password } = body;
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid email format");
    }
};

const validateSignUp = (body) => {
    const { fullName, email, password } = body;
    if (!fullName || !email || !password) {
        throw new Error("Full name, email and password are required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid email format");
    }
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }
};

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
            role: user.role,
            isAdmin: user.isAdmin || false
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

    // Send welcome email with credentials
    try {
        await sendWelcomeEmail(email, fullName, password);
        console.log('Welcome email sent to:', email);
    } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't throw error - user creation should still succeed
    }

    return {
        token,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin || false
        }
    };
};
