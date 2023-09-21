import { BaseViewModel } from "@/_core/models/BaseViewModel";
import { required } from "@vuelidate/validators";
import { GreetCardSliderModel } from "./GreetCardSliderModel";

export default class GreetCardCategoryModel extends BaseViewModel {
  id: string | number;
  title: string;
  image_url?: string | null;
  description: string | null = "Описание категории";
  position: string | number = 1;
  is_active: boolean;
  created_at?: string;
  groups: GreetCardSliderModel[];

  public constructor(init?: Partial<GreetCardCategoryModel>) {
    super();
    Object.assign(this, init);
  }
}

export const validationsRule = () => {
  return {
    title: { required },
    description: { required },
  };
};
