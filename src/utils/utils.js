import { fileURLToPath } from "url";
import fs from "fs-extra";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonMessagesFilePath = path.resolve(__dirname, "../data/data.json");
export const readDataFromFile = async () => {
  try {
    return await fs.readJSON(jsonMessagesFilePath);
  } catch (error) {
    return { numberOfCalls: 0, lastMessage: null };
  }
};

export const writeDataToFile = async (messages) => {
  await fs.writeJSON(jsonMessagesFilePath, messages);
};
