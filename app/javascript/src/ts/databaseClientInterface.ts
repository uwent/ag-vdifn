import type {
  Severity,
  PointDetailsParams,
  SeverityParams,
  CropWithPests,
  DegreeDayModel,
  LegendData,
} from '@types';

export default interface DatabaseClientInterface {
  fetchDiseasePanel(): Promise<CropWithPests[]>;
  fetchInsectPanel(): Promise<CropWithPests[]>;
  fetchCustomPanel(): Promise<DegreeDayModel[]>;
  fetchSeverityLegend(pestId: number): Promise<LegendData>;
  fetchSeverities(severityParams: SeverityParams): Promise<Severity[]>;
  fetchPointDetails(pointDetailsParams: PointDetailsParams): Promise<string>;
}
