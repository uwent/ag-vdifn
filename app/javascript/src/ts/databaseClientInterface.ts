import type {
  Severity,
  PointDetailsParams,
  SeverityParams,
  CropWithPests,
  DegreeDayModel,
  Pest,
  LegendData,
} from '@types';

export default interface DatabaseClientInterface {
  fetchDiseasePanel(): Promise<CropWithPests[]>;
  fetchInsectPanel(): Promise<CropWithPests[]>;
  fetchCustomPanel(): Promise<DegreeDayModel[]>;
  fetchSeverityLegend(pestId: number): Promise<LegendData>;
  // fetchSeverityLegendInfo(pestId: number): Promise<string>;
  fetchSeverities(severityParams: SeverityParams): Promise<Severity[]>;
  fetchPointDetails(pointDetailsParams: PointDetailsParams): Promise<string>;
}

export interface DiseasePanelData {
  id: number;
  name: string;
  diseases: Pest[];
}
