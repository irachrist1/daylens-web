import type { Id } from "./_generated/dataModel";

type AuthLikeCtx = {
  auth: {
    getUserIdentity(): Promise<Record<string, unknown> | null>;
  };
};

export type SessionIdentity = {
  workspaceId: Id<"workspaces">;
  deviceId: string;
  sessionKind: "desktop" | "web";
};

export async function requireSessionIdentity(
  ctx: AuthLikeCtx
): Promise<SessionIdentity> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new Error("Not authenticated");
  }

  const workspaceId = identity.workspaceId;
  const deviceId = identity.deviceId;
  const sessionKind = identity.sessionKind;

  if (
    typeof workspaceId !== "string" ||
    typeof deviceId !== "string" ||
    (sessionKind !== "desktop" && sessionKind !== "web")
  ) {
    throw new Error("Invalid session");
  }

  return {
    workspaceId: workspaceId as Id<"workspaces">,
    deviceId,
    sessionKind,
  };
}
