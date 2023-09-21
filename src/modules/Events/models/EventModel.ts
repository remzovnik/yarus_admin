import { BaseViewModel } from "@/_core/models/BaseViewModel";

export interface City {
  id: number;
  region: string;
  name: string;
  timezoneOffset: number;
  primary: boolean;
}
export enum EventModerationActionType {
  APPROVE = "approved",
  REJECT = "rejected",
}

export class EventModel extends BaseViewModel {
  id: number;
  name: string;
  minPrice: number;
  maxPrice: number;
  checkPrice: boolean;
  rating: number;
  cover: string;
  ageRestriction: number;
  category: string;
  categoryID: number;
  place: string;
  city: City;
  since: number;
  till: number;
  statusString: string;
  createdAt: number;
}

export enum EventCategory {
  ON_MODERATION = "pending",
  APPROVED = "approved",
  NOT_APPROVED = "rejected",
}

export enum EventStatus {
  pending = "На модерацию",
  approved = "Одобрено",
  rejected = "Не одобрено",
}
