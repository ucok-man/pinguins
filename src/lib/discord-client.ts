// We cannot use regular discord.js package eventhough we use it on server env. -> TODO: Why??
// regular package try to import discordjs/ws

import axios from "axios";
import {
  APIEmbed,
  APIGuild,
  APIUser,
  RESTPostAPIChannelMessageResult,
  RESTPostAPICurrentUserCreateDMChannelResult,
} from "discord-api-types/v10";

export class DiscordClient {
  private baseUrl = "https://discord.com/api";

  // Requires user access token (so override Authorization here)
  getCurrentUser = async (accessToken: string) => {
    const result = await axios.get(`${this.baseUrl}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result.data as APIUser;
  };

  addGuildMember = async (discordUserId: string, accessToken: string) => {
    const result = await axios.put(
      `${this.baseUrl}/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordUserId}`,
      {
        access_token: accessToken,
      },
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );

    return result.data as APIGuild;
  };

  createDMChannel = async (
    userDiscordId: string
  ): Promise<RESTPostAPICurrentUserCreateDMChannelResult> => {
    const result = await axios.post(
      `${this.baseUrl}/users/@me/channels`,
      {
        recipient_id: userDiscordId,
      },
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return result.data as RESTPostAPICurrentUserCreateDMChannelResult;
  };

  sendMessage = async (
    channelId: string,
    embed: APIEmbed
  ): Promise<RESTPostAPIChannelMessageResult> => {
    const result = await axios.post(
      `${this.baseUrl}/channels/${channelId}/messages`,
      {
        embeds: [embed],
      },
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return result.data as RESTPostAPIChannelMessageResult;
  };
}
