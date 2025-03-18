import type {
  Severity,
  SeverityLegend,
  PointDetailsParams,
  SeverityParams,
  CropWithPests,
} from '@types';

export default interface DatabaseClientInterface {
  fetchSeverities(severityParams: SeverityParams): Promise<Severity[]>;
  fetchSeverityLegend(pestId: number): Promise<SeverityLegend[]>;
  fetchSeverityLegendInfo(pestId: number): Promise<string>;
  fetchPointDetails(pointDetailsParams: PointDetailsParams): Promise<string>;
  // fetchPestInfo(pestId: number, inFahrenheit: boolean): Promise<PestInfo>
  // fetchStationDetails(stationDetailParams: StationDetailsParams): Promise<string>
  fetchDiseasePanel(): Promise<CropWithPests[]>;
  fetchInsectPanel(): Promise<CropWithPests[]>;
}
