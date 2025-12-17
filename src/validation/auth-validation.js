export const validateSignIn = ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Email and password required");
    }

    if (!email.includes("@")) {
        throw new Error("Invalid email");
    }
};

export const validateSignUp = ({
    fullName,
    email,
    password,
    confirmPassword
}) => {
    if (!fullName || !email || !password || !confirmPassword) {
        throw new Error("All fields are required");
    }

    if (!email.includes("@")) {
        throw new Error("Invalid email");
    }

    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
    }
};
