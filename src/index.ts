import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});
client.once("ready", () => {
  console.log("Discord bot is ready! 🤖");
});

// register commands when added to a server
client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

// article says "Run corresponding command when new user interaction has been created"
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  // 11 is the amount of images, make dynamic based on directory
  const randomIndex = Math.floor(Math.random() * 11) + 1;
  const imageName = randomIndex.toString() + ".jpg";

  if (message.content.toLowerCase().includes("f1")) {
    // message.channel.send("leclerc washed");
    message.channel.send({
      files: ["./images/compressed/" + imageName],
    });
  }
});

client.login(config.DISCORD_TOKEN);
