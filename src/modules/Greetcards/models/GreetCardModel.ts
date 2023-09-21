import { BaseViewModel } from "@/_core/models/BaseViewModel";
import { required } from "@vuelidate/validators";

export class GreetCardModel extends BaseViewModel {
  id: string | number;
  group_id: string | number | null;
  image_url: string;
  position: string | number = 1;
  is_active: boolean;
  created_at?: string;

  public constructor(init?: Partial<GreetCardModel>) {
    super();
    Object.assign(this, init);
  }
}

export enum GreetCardStatisticType {
  MOST_POPULAR_CATEGORY,
  MOST_POPULAR_SLIDER,
  MOST_POPULAR_CARD,
  TEXT,
}

export const validationsRule = () => {
  return {
    image_url: { required },
    group_id: { required },
  };
};
