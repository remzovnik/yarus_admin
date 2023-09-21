import UserModel from "@/modules/Auth/models/UserModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";
import ContentItemModel from "./ContentItemModel";
import FeedModel from "./FeedModel";
import { Metrics, MetricsFull } from "./MetricsModel";

export default class ContentDetailModel extends BaseViewModel {
  id: number;
  feed: FeedModel;
  feedId: number;
  metrics: Metrics;
  metricsFull: MetricsFull;
  user?: UserModel;
  createDate: number;
  isCovid: boolean;
  age?: number;
  items: ContentItemModel[];
  description;
  name;
  image;
  originalLink;

  imageOriginal;
  width;
  widthOriginal;
  height;
  heightOriginal;
}
