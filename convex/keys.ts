"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import * as crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey(): Buffer {
  const secret = process.env.CONVEX_ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error("CONVEX_ENCRYPTION_SECRET not set");
  }
  return crypto.createHash("sha256").update(secret).digest();
}

function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted}`;
}

export function decrypt(encryptedStr: string): string {
  const key = getEncryptionKey();
  const [ivB64, tagB64, ciphertext] = encryptedStr.split(":");
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export const store = action({
  args: {
    workspaceId: v.id("workspaces"),
    anthropicKey: v.string(),
  },
  handler: async (ctx, args) => {
    const encrypted = encrypt(args.anthropicKey);
    await ctx.runMutation(internal.keysMutations.upsertEncryptedKey, {
      workspaceId: args.workspaceId,
      encryptedAnthropicKey: encrypted,
    });
    return { success: true };
  },
});
