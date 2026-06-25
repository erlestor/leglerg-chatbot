import fs from "fs"
import path from "path"
import { AttachmentBuilder, Client } from "discord.js"

import { deployCommands } from "./deploy-commands"
import { config } from "./config"
import { commands } from "./commands"
import { nextIndex } from "./utils/random"

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
})
client.once("ready", () => {
  console.log("Discord bot is ready! 🤖")
})

// register commands when added to a server
client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id })
})

// article says "Run corresponding command when new user interaction has been created"
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }
  const { commandName } = interaction
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction)
  }
})

const imagePaths = fs
  .readdirSync("./images/compressed")
  .filter((file) => file.endsWith(".jpg"))
  .map((file) => path.join("./images/compressed", file))

const images = imagePaths.map((imagePath) => new AttachmentBuilder(imagePath))

// send leclerc images
client.on("messageCreate", (message) => {
  if (message.author.bot) return
  if (message.author.username !== "erlebd") return

  // 11 is the amount of images, make dynamic based on directory
  const randomImage = images[nextIndex()]

  message.channel.send({
    files: [randomImage],
  })
})

client.login(config.DISCORD_TOKEN)
