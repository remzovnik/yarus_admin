import FeedModel from "@/modules/Yarus/models/FeedModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";

export interface SuperApp {
  follower: boolean;
  subscription: boolean;
  comment: boolean;
}

export default class UserModel extends BaseViewModel {
  id = 0;
  name: string;
  surname: string;
  photo: string;
  nickname: string;
  description?: string;
  birthday?: any;
  gender: 1 | 0;
  approved: boolean;
  isSubscribe: boolean;
  isReal: boolean;
  coinAgreement: 1 | 0;
  superApp: SuperApp;
  countSubscribers: number;
  countSubscription: number;
  stats: {
    subscriber: number;
    subscription: number;
    feed: number;
    post: number;
    comment: number;
    event: number;
    clip: number;
    video: number;
  };

  feeds: FeedModel[];
  // Для отличия от фида
  userId = 0;
}
