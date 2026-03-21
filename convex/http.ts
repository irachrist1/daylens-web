import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/uploadSnapshot",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
    const { workspaceId, deviceId, localDate, snapshot } = body;

    if (!workspaceId || !deviceId || !localDate || !snapshot) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const id = await ctx.runMutation(api.snapshots.upload, {
        workspaceId,
        deviceId,
        localDate,
        snapshot,
      });

      await ctx.runMutation(api.snapshots.recordSync, {
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

    const result = await ctx.runMutation(api.workspaces.create, {
      recoveryKeyHash,
    });

    const linkResult = await ctx.runMutation(api.linkCodes.create, {
      workspaceId: result.workspaceId,
    });

    return new Response(
      JSON.stringify({
        workspaceId: result.workspaceId,
        linkCode: linkResult.code,
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

    const result = await ctx.runMutation(api.workspaces.recover, {
      recoveryKeyHash,
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
    const body = await req.json();
    const { workspaceId, anthropicKey } = body;

    if (!workspaceId || !anthropicKey) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await ctx.runAction(api.keys.store, {
      workspaceId,
      anthropicKey,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
