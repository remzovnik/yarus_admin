import UserModel from "@/modules/Auth/models/UserModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";
import MetricsFullModel from "./MetricsFullModel";

export default class ClipItemModel extends BaseViewModel {
  id: number;
  description: string;
  file: string;
  createDate: number;
  image: string;
  status: number;
  user: UserModel;
  metricsFull: MetricsFullModel;
}
