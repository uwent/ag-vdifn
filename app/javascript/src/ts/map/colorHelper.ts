import chroma from 'chroma-js';
import { COLORS } from './colors';

export default class ColorHelper {
  static color(severity: number, severityLevels: number): string {
    return this.getColor(severity, severityLevels, [COLORS.lightGreen, COLORS.yellow, COLORS.red]);
  }

  static colorInverse(severity: number, severityLevels: number): string {
    return this.getColor(severity, severityLevels, [COLORS.red, COLORS.yellow, COLORS.lightGreen]);
  }

  private static getColor(severity, severityLevels, _scale) {
    const scale = chroma.scale(_scale).domain([...Array(severityLevels).keys()]);
    return scale(severity).hex() as string;
  }
}
