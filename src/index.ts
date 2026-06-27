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

client.once("ready", async () => {
  console.log("Discord bot is ready! 🤖")
  await deployCommands({ guildId: config.GUILD_ID })
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
  if (message.author.username !== targetedUsername) return

  const on_state = fs.readFileSync("./on_state.txt").toString()
  if (on_state !== "on") return

  const randomImage = images[nextIndex()]

  message.channel.send({
    content: 'To turn off the bot. Type "/give_steinar_a_break"',
    files: [randomImage],
  })
})

client.login(config.DISCORD_TOKEN)

// make render happy since im hosting there. remove if not
import http from "http"
import { targetedUsername } from "./utils/constants"
http.createServer((_, res) => res.end("ok")).listen(process.env.PORT || 3000)
