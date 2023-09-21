import UserModel from "@/modules/Auth/models/UserModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";
import { Metrics, MetricsFull } from "./MetricsModel";

export default class VideoModel extends BaseViewModel {
  id: number;
  status: number;
  user: UserModel;
  name: string;
  description: string;
  duration: number;
  createDate: number;
  image: string;
  m3u8: string;
  original?: any;
  metrics: Metrics;
  metricsFull: MetricsFull;
  countShow: number;
  isCovid: boolean;
  embed: boolean;
  embedType: number;
  embedId: string;
  sourceType: number;
  watermark: string;
  tags: any[];
  originalLink: string;
  file: string;
}
