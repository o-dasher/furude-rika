import StringUtils from '@furude-utils/StringUtils';
import { Client } from 'discord.js';

abstract class Task {
  public abstract name: string;
  protected readonly client: Client;
  protected sleepTime: number = 1000;
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

  protected async sleep(): Promise<void> {
    return new Promise((res) => setTimeout(res, this.sleepTime));
  }

  protected abstract onStart(): Promise<void>;
}

export default Task;
