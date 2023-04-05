import { GuildMemberRoleManager, Interaction, PermissionFlagsBits } from 'discord.js';

export async function interactionCreateListener(interaction: Interaction): Promise<void> {
  if (!interaction.inGuild()) return;
  if (interaction.isButton()) {
    const customId = interaction.customId;
    // Only allow v1 buttons
    if (!customId.startsWith('v1:')) return;
    // Make sure the guild is cached
    if (interaction.guild === null) {
      await interaction.reply({
        content: `The bot is not in this guild.`,
        ephemeral: true,
      });
      return;
    }
    // Check if the bot has permissions to manage roles
    if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await interaction.reply({
        content: `The bot does not have permissions to give roles.`,
        ephemeral: true,
      });
      return;
    }
    // Get role to give
    const roleId = customId.substring('v1:'.length);
    const roleToGive = interaction.guild.roles.cache.get(roleId);
    if (!roleToGive) {
      await interaction.reply({
        content: `The role does not exist in the guild.`,
        ephemeral: true,
      });
      return;
    }
    const guildMemberRoleManager = interaction.member.roles as GuildMemberRoleManager;
    if (!guildMemberRoleManager.cache.has(roleId)) {
      // If they don't have the role, add it
      try {
        await guildMemberRoleManager.add(roleId);
      } catch (e) {
        console.log(e);
        await interaction.reply({
          content: `An error occurred while trying to add the role.`,
          ephemeral: true,
        });
        return;
      }
      await interaction.reply({
        content: `The role <@&${roleId}> has been added to you.`,
        ephemeral: true,
      });
      return;
    } else {
      // If they have the role, remove it
      try {
        await guildMemberRoleManager.remove(roleId);
      } catch (e) {
        console.log(e);
        await interaction.reply({
          content: `An error occurred while trying to remove the role.`,
          ephemeral: true,
        });
        return;
      }
      await interaction.reply({
        content: `The role <@&${roleId}> has been removed from you.`,
        ephemeral: true,
      });
      return;
    }
  }
}
