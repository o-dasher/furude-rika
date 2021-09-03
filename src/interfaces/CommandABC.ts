import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Command from "./Command";

class CommandABC extends SlashCommandBuilder implements Command {
  run(interaction: CommandInteraction): void {
    throw new Error("Method not implemented.");
  }
}

export default CommandABC;