import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const http = httpRouter();

http.route({
  path: "/uploadSnapshot",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { localDate, snapshot } = body;
    const workspaceId = identity.workspaceId as Id<"workspaces">;
    const deviceId = identity.deviceId;

    if (
      typeof deviceId !== "string" ||
      !localDate ||
      !snapshot
    ) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const registeredDevices = await ctx.runQuery(internal.devices.listForWorkspace, {
        workspaceId,
      });
      const registeredDevice = registeredDevices.find(
        (device: { deviceId: string }) => device.deviceId === deviceId
      );

      if (!registeredDevice) {
        return new Response(JSON.stringify({ error: "Unknown device" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (snapshot?.deviceId !== deviceId) {
        return new Response(JSON.stringify({ error: "Device mismatch" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      const id = await ctx.runMutation(internal.snapshots.upload, {
        workspaceId,
        deviceId,
        localDate,
        snapshot,
      });

      await ctx.runMutation(internal.snapshots.recordSync, {
        workspaceId,
        deviceId,
      });

      return new Response(JSON.stringify({ success: true, id }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Upload failed" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

http.route({
  path: "/createWorkspace",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
    const { recoveryKeyHash } = body;

    if (!recoveryKeyHash) {
      return new Response(JSON.stringify({ error: "Missing recoveryKeyHash" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await ctx.runMutation(internal.workspaces.create, {
      recoveryKeyHash,
    });

    const deviceId = typeof body.deviceId === "string" ? body.deviceId : "desktop-device";
    const displayName =
      typeof body.displayName === "string" && body.displayName.trim()
        ? body.displayName.trim()
        : "This Mac";

    await ctx.runMutation(internal.devices.upsertForWorkspace, {
      workspaceId: result.workspaceId,
      deviceId,
      platform: "macos",
      displayName,
    });

    const session = await ctx.runAction(internal.sessionTokens.issue, {
      workspaceId: result.workspaceId,
      deviceId,
      sessionKind: "desktop",
    });

    return new Response(
      JSON.stringify({
        workspaceId: result.workspaceId,
        sessionToken: session.token,
        sessionExpiresAt: session.expiresAt,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),
});

http.route({
  path: "/recoverWorkspace",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
    const { recoveryKeyHash } = body;

    if (!recoveryKeyHash) {
      return new Response(JSON.stringify({ error: "Missing recoveryKeyHash" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await ctx.runQuery(internal.workspaces.recover, {
      recoveryKeyHash,
    });

    if (!result.workspaceId) {
      return new Response(JSON.stringify({ error: "Workspace not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deviceId = typeof body.deviceId === "string" ? body.deviceId : "desktop-device";
    const displayName =
      typeof body.displayName === "string" && body.displayName.trim()
        ? body.displayName.trim()
        : "This Mac";

    await ctx.runMutation(internal.devices.upsertForWorkspace, {
      workspaceId: result.workspaceId,
      deviceId,
      platform: "macos",
      displayName,
    });

    const session = await ctx.runAction(internal.sessionTokens.issue, {
      workspaceId: result.workspaceId,
      deviceId,
      sessionKind: "desktop",
    });

    return new Response(JSON.stringify({
      workspaceId: result.workspaceId,
      sessionToken: session.token,
      sessionExpiresAt: session.expiresAt,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/createLinkCode",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { tokenHash, displayCode } = body;

    if (!tokenHash || !displayCode) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (typeof identity.workspaceId !== "string") {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await ctx.runMutation(internal.linkCodes.create, {
      workspaceId: identity.workspaceId as Id<"workspaces">,
      tokenHash,
      displayCode,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/storeApiKey",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { anthropicKey } = body;

    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (typeof identity.workspaceId !== "string") {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await ctx.runAction(internal.keys.store, {
      workspaceId: identity.workspaceId as Id<"workspaces">,
      anthropicKey,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
