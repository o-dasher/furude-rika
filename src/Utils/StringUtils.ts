abstract class StringUtils {
  private constructor() {}

  public static errorString(value: string): string {
    return this.boldString(`:negative_squared_cross_mark: - ${value}`);
  }

  public static successString(value: string): string {
    return this.boldString(`:white_check_mark: - ${value}`);
  }

  public static boldString(value: string): string {
    return `**${value}**`;
  }

  public static blockQuote(value: string): string {
    return `>>> ${value}`;
  }
}

export default StringUtils;
