import { PointDetailsParams } from "src/components/common/TypeScript/typess
import DataPoint from "../../../map/TypeScript/dataPoint/TypeScript/dataPoint";

export default interface ForecastMapInterface {
    drawDataPoints(dataPoints: DataPoint[], pointDetailsParams: PointDetailsParams);
    clearDataPoints(): void;
}
