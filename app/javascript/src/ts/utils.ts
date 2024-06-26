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

export function round(num: number, precision: number = 0): number {
  const mult = Math.pow(10, precision);
  return Math.round((num + Number.EPSILON) * mult) / mult;
}

export function strToNum(val: string | number): number {
  return val === '' ? NaN : Number(val);
}
