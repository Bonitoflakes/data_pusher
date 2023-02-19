import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = crypto.createHash("sha512").update("secret_key").digest("hex").substring(0, 32);
const iv = crypto.createHash("sha512").update("secret_iv").digest("hex").substring(0, 16);

export function encryptData(data) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  return Buffer.from(cipher.update(data, "utf8", "hex") + cipher.final("hex")).toString("base64"); // Encrypts data and converts to hex and base64
}

export function decryptData(encryptedData) {
  const buff = Buffer.from(encryptedData, "base64");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return decipher.update(buff.toString("utf8"), "hex", "utf8") + decipher.final("utf8"); // Decrypts data and converts to utf8
}
