import type {
  Severity,
  SeverityLegend,
  PointDetailsParams,
  SeverityParams,
  CropWithAfflictions,
} from '@types';

export default interface DatabaseClientInterface {
  fetchSeverities(severityParams: SeverityParams): Promise<Severity[]>;
  fetchSeverityLegend(pestId: number): Promise<SeverityLegend[]>;
  fetchSeverityLegendInfo(pestId: number): Promise<string>;
  fetchPointDetails(pointDetailsParams: PointDetailsParams): Promise<string>;
  // fetchPestInfo(pestId: number, inFahrenheit: boolean): Promise<PestInfo>
  // fetchStationDetails(stationDetailParams: StationDetailsParams): Promise<string>
  fetchDiseasePanel(): Promise<CropWithAfflictions[]>;
  fetchInsectPanel(): Promise<CropWithAfflictions[]>;
}
