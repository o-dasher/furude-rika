class ParamString {
  private string: string;

  public constructor(string_: string) {
    this.string = string_;
    if (this.string.slice(-1) !== '?') {
      this.string = this.string.concat('?');
    }
  }

  public addParam(param: string, value: string) {
    this.string = this.string.concat(`${param}=${value}&`);
  }

  public toString(): string {
    return this.string;
  }
}

export default ParamString;
