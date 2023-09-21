import { BaseViewModel } from "@/_core/models/BaseViewModel";
import CityModel from "./CityModel";

export default class EventItemModel extends BaseViewModel {
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
  city: CityModel;
  since: number;
  till: number;
  statusString: string;
  createdAt: number;
}
