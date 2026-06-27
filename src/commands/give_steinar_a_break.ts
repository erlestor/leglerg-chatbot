import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import fs from "fs"
import { targetedUsername } from "../utils/constants"

export const data = new SlashCommandBuilder()
  .setName("give_steinar_a_break")
  .setDescription("Turns off the bot")

export async function execute(interaction: CommandInteraction) {
  if (interaction.user.username === targetedUsername) {
    await interaction.reply("Haha du e gay steinar")
    return
  }

  fs.writeFileSync("./on_state.txt", "off")
  return interaction.reply("Steinar gay. Bot suspended")
}
