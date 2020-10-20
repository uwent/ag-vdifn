export default class Temperature {

  static to_c(in_f: number): string {
    return this.to_tenths((in_f - 32) * 5.0/9.0)
  }

  static to_f(in_c: number): string {
    return this.to_tenths((in_c * 9.0/5.0) + 32.0)
  }

  private static to_tenths(num: number): string {
    const new_num = Math.round(num * 10)
    if (new_num % 10 == 0)
    {
      return new_num/10 + ".0"
    }
    else
    {
      return (new_num/10).toString()
    }
  }
}
