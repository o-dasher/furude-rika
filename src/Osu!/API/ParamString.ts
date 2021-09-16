class ParamString {
  private string: string;

  public constructor(string_: string) {
    this.string = string_;
    if (this.string.slice(-1) !== '?') {
      this.string = this.string += '?';
    }
  }

  public addParam(param: string, value: string) {
    this.string = this.string += `${param}=${value}&`;
  }

  public toString(): string {
    return this.string.slice(0, -1);
  }
}

export default ParamString;
