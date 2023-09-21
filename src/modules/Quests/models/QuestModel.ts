import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class QuestModel extends BaseViewModel {
  id: number;
  title: string;
  description: string;
  image: string;
  image_main: string;
  tagline_main: string;
  link: string;
  bg_color: string;
  ribbon_color: string;
  priority: number;
  is_main: boolean;
  is_popular: boolean;
  category: CategoryModel;
  created_at?: string;
}

interface CategoryModel {
  id: number;
  name: string;
}
