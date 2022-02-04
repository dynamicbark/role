import { GuildMemberRoleManager, Interaction } from 'discord.js';

export async function interactionCreateListener(interaction: Interaction): Promise<void> {
  if (!interaction.inGuild()) return;
  if (interaction.isButton()) {
    const customId = interaction.customId;
    // Only allow v1 buttons
    if (!customId.startsWith('v1:')) return;
    // Make sure the guild is cached
    if (interaction.guild === null) {
      return interaction.reply({
        content: `The bot is not in this guild.`,
        ephemeral: true,
      });
    }
    // Check if the bot has permissions to manage roles
    if (!interaction.guild.me?.permissions.has('MANAGE_ROLES')) {
      return interaction.reply({
        content: `The bot does not have permissions to give roles.`,
        ephemeral: true,
      });
    }
    // Get role to give
    const roleId = customId.substring('v1:'.length);
    const roleToGive = interaction.guild.roles.cache.get(roleId);
    if (!roleToGive) {
      return interaction.reply({
        content: `The role does not exist in the guild.`,
        ephemeral: true,
      });
    }
    const guildMemberRoleManager = interaction.member.roles as GuildMemberRoleManager;
    if (!guildMemberRoleManager.cache.has(roleId)) {
      // If they don't have the role, add it
      try {
        await guildMemberRoleManager.add(roleId);
      } catch (e) {
        console.log(e);
        return interaction.reply({
          content: `An error occurred while trying to add the role.`,
          ephemeral: true,
        });
      }
      return interaction.reply({
        content: `The role <@&${roleId}> has been added to you.`,
        ephemeral: true,
      });
    } else {
      // If they have the role, remove it
      try {
        await guildMemberRoleManager.remove(roleId);
      } catch (e) {
        console.log(e);
        return interaction.reply({
          content: `An error occurred while trying to remove the role.`,
          ephemeral: true,
        });
      }
      return interaction.reply({
        content: `The role <@&${roleId}> has been removed from you.`,
        ephemeral: true,
      });
    }
  }
}
