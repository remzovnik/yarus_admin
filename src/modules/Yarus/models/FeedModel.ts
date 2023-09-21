import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class FeedModel extends BaseViewModel {
  id: number;
  name: string;
  userId: number;
  image: string;
  approved: boolean;
  countSubscriber: number;
  type: 0 | 1;
  isSubscribe: boolean;
}
