import { internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const getByWorkspace = internalQuery({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("encrypted_keys")
      .withIndex("by_workspace", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .first();
  },
});
