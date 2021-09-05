abstract class TypeUtils {
  private constructor() {}

  public static isArray(o: any): boolean {
    return Object.prototype.toString.call(o) === '[object Array]';
  }
}

export default TypeUtils;
