import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import fs from "fs"

export const data = new SlashCommandBuilder()
  .setName("ragebait_steinar")
  .setDescription("Turns on the bot")

export async function execute(interaction: CommandInteraction) {
  fs.writeFileSync("./on_state.txt", "on")
  return interaction.reply("Steinar gay. Bot resumed")
}
