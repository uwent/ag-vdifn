import * as chroma from 'chroma-js';
import { COLORS } from './colors';

export default class ColorHelper {
  static color(severity: number, severityLevels: number): string {
    return this.getColor(severity, severityLevels, [COLORS.low, COLORS.med, COLORS.high]);
  }

  static colorInverse(severity: number, severityLevels: number): string {
    return this.getColor(severity, severityLevels, [COLORS.high, COLORS.med, COLORS.low]);
  }

  private static getColor(severity, severityLevels, _scale) {
    const scale = chroma.scale(_scale).domain([...Array(severityLevels).keys()]) as any;
    return scale(severity).hex();
  }
}
