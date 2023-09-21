import { BaseViewModel } from "@/_core/models/BaseViewModel";
import { required } from "@vuelidate/validators";
import { GreetCardModel } from "./GreetCardModel";

export class GreetCardSliderModel extends BaseViewModel {
  id: string | number;
  title: string;
  description: string | null;
  cards?: GreetCardModel[];
  category_id: string | number | null;
  created_at?: string;
  position: string | number = 1;
  is_active: boolean;

  public constructor(init?: Partial<GreetCardSliderModel>) {
    super();
    Object.assign(this, init);
  }
}

export const validationsRule = () => {
  return {
    title: { required },
    description: { required },
    category_id: { required },
  };
};
