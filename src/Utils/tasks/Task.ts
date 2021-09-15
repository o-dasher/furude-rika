import StringUtils from '@furude-utils/StringUtils';
import { Client } from 'discord.js';

abstract class Task {
  protected readonly client: Client;
  private runnedStart: boolean = false;

  public constructor(client: Client) {
    this.client = client;
  }

  public async start(): Promise<void> {
    if (this.runnedStart) {
      throw StringUtils.errorString(
        'Task.start() should be only executed once!'
      );
    }
    this.runnedStart = true;
    await this.onStart();
  }

  protected abstract onStart(): Promise<void>;
}

export default Task;
