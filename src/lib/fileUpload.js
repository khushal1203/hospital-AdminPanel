import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const uploadFileLocally = async (buffer, folder, filename) => {
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  return `/uploads/${folder}/${filename}`;
};
