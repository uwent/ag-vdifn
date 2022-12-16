// convert fahrenheit to celcius with one decimal point
export function f_to_c(f: number) {
  if (f == undefined || f == null) return f
  return Math.round((f - 32.0) * (5 / 9) * 10) / 10
}

// convert celcius to fahrenheit with one decimal point
export function c_to_f(c: number) {
  if (c == undefined || c == null) return c
  return Math.round((c * (9.0 / 5) + 32) * 10) / 10
}
