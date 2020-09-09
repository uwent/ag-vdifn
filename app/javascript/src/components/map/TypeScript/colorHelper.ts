import { COLORS } from "../../common/TypeScript/colors";
import chroma from 'chroma-js';

export default class ColorHelper {
    static color(severity: number, severityLevels: number): string {
        const scale = chroma
            .scale([COLORS.lightGreen, COLORS.yellow, COLORS.red])
            .domain([...Array(severityLevels + 1).keys()])
        return scale(severity).hex() as string;
    }
} 
