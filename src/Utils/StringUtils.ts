abstract class StringUtils {
  private constructor() {}

  public static prefixedString(prefix: string, value: string): string {
    return `${prefix} | ${value}`;
  }

  public static errorString(value: string): string {
    return this.boldString(this.prefixedString('❎', value));
  }

  public static successString(value: string): string {
    return this.boldString(this.prefixedString('✅', value));
  }

  public static boldString(value: string): string {
    return `**${value}**`;
  }

  public static blockQuote(value: string): string {
    return `>>> ${value}`;
  }
}

export default StringUtils;
