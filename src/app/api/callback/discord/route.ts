import { db } from "@/lib/db-client";
import { DiscordClient } from "@/lib/discord-client";
import { auth } from "@clerk/nextjs/server";
import { APIUser } from "discord-api-types/v10";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../api-error";

export async function GET(req: NextRequest) {
  try {
    // Check auth
    const clerkUser = await auth();
    if (!clerkUser.userId) {
      throw ApiError.unauthorized(
        "You are not allowed to access this resource"
      );
    }

    // Get OAuth2 code from query
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      throw ApiError.badRequest("Missing `code` from Discord callback");
    }

    // Exchange code for token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI!,
        grant_type: "authorization_code",
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw ApiError.internalServer(
        new Error(`Failed to exchange code: ${tokenRes.status} - ${errText}`)
      );
    }

    const resultExchange: any = await tokenRes.json();
    const { access_token } = resultExchange;

    if (!access_token) {
      throw ApiError.internalServer(
        new Error("No access_token found in Discord callback exchange")
      );
    }

    // Init Discord client
    const discord = new DiscordClient();

    // Fetch Discord user
    let discordUser: APIUser;
    try {
      discordUser = await discord.getCurrentUser(access_token);
    } catch (err) {
      throw ApiError.internalServer(
        new Error("Failed to fetch Discord user profile")
      );
    }

    // Add user to guild
    try {
      await discord.addGuildMember(discordUser.id, access_token);
    } catch (err) {
      throw ApiError.internalServer(
        new Error(
          `Failed to add user ${discordUser.id} to guild: ${String(err)}`
        )
      );
    }

    // Update DB with Discord user id
    try {
      await db.user.update({
        where: { externalId: clerkUser.userId },
        data: { discordId: discordUser.id },
      });
    } catch (err) {
      throw ApiError.internalServer(
        new Error(`Failed to update DB with Discord ID: ${String(err)}`)
      );
    }

    // Success: redirect
    return NextResponse.redirect(new URL("/dashboard/integrations", req.url));
  } catch (err) {
    // console.error("❌ Discord callback error:", err);

    if (err instanceof ApiError) {
      throw err; // re-throw custom API error
    }

    throw ApiError.internalServer(err as any);
  }
}
