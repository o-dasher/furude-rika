import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Command from "./Command";

abstract class CommandABC extends SlashCommandBuilder implements Command {
  abstract run(interaction: CommandInteraction): void;
}

export default CommandABC;