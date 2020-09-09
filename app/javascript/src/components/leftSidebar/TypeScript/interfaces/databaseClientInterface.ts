import { Severity, SeverityLegend, PestInfo, PointDetailsParams, SeverityParams, StationDetailsParams } from '../../../common/TypeScript/types/typesidebar/TypeScript/types/types';

export default interface DatabaseClientInterface {
    fetchSeverities(severityParams: SeverityParams): Promise<Severity[]>;
    fetchSeverityLegend(pestId: number): Promise<SeverityLegend[]>;
    fetchPointDetails(pointDetailsParams: PointDetailsParams): Promise<string>
    fetchPestInfo(pestId: number, inFahrenheit: boolean): Promise<PestInfo>;
    fetchStationDetails(stationDetailParams: StationDetailsParams): Promise<string>;
}

