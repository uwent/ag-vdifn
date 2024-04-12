// convert fahrenheit to celcius with one decimal point
export function f_to_c(f: number | null) {
  if (f === null) return null;
  return Math.round((f - 32.0) * (5 / 9) * 10) / 10;
}

// convert celcius to fahrenheit with one decimal point
export function c_to_f(c: number | null) {
  if (c === null) return null;
  return Math.round((c * (9.0 / 5) + 32) * 10) / 10;
}
