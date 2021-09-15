import { number } from 'mathjs';

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

  public static hyperLink(value: string, url: string): string {
    return `[${value}](${url})`;
  }

  public static objectToKeyValueString(
    obj: any,
    options?: {
      fixedNumber?: number;
    }
  ) {
    if (!options) {
      options = {
        fixedNumber: 0
      };
    } else {
      options.fixedNumber = options.fixedNumber ?? 0;
    }

    let s = '';
    for (const k in obj) {
      const v = (obj as Record<string, any>)[k];
      s += `${k}: `;
      s += typeof v === 'number' ? `${v.toFixed(options.fixedNumber)}` : v;
      s += '\n';
    }
    
    return s;
  }
}

export default StringUtils;
