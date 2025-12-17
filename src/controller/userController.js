import User from "@/modals/userModal";

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
