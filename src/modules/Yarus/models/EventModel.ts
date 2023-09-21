import UserModel from "@/modules/Auth/models/UserModel";
import { BaseViewModel } from "@/_core/models/BaseViewModel";
import EventItemModel from "./EventItemModel";

export interface Photo {
  id: number;
  image: string;
  imageWidth: number;
  imageHeight: number;
}

export default class EventModel extends BaseViewModel {
  id: number;
  name: string;
  description: string;
  category: string;
  categoryID: number;
  site: string;
  photos: Photo[];
  tags: string[];
  ageRestriction: number;
  link: string;
  status: number;
  ratingCount: number;
  minPrice: number;
  maxPrice: number;
  author: UserModel;
  rating: number;
  estimate: boolean;
  isFree: boolean;
  isOnline: boolean;
  detailURL: string;
  soldOut: boolean;
  similar: EventItemModel[];
  place: string;
  subscribedUserIds: number[];
  subscribersCount: number;
  statusString: string;
  subscribedUser: UserModel[];
}
