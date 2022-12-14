// convert fahrenheit to celcius with one decimal point
export function f_to_c(f: number) {
  if (typeof f != "number") return f
  return Math.round((f - 32.0) * (5 / 9) * 10) / 10
}

// convert celcius to fahrenheit with one decimal point
export function c_to_f(c: number) {
  if (typeof c != "number") return c
  return Math.round((c * (9.0 / 5) + 32) * 10) / 10
}
