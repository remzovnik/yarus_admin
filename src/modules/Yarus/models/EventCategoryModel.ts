import { BaseViewModel } from "@/_core/models/BaseViewModel";
export default class EventCategoryModel extends BaseViewModel {
  id: number;
  name: string;
  position: number;
  image: string;
  icon: string;
  color: string;
  isSelected: boolean;
}
